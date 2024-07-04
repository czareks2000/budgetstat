using Application.Core;
using Application.Dto.Account;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class AccountService(
        DataContext context, 
        IUtilities utilities,
        IMapper mapper) : IAccountService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        // funkcja zwraca liste wszytkich kont użytkownika 
        public async Task<Result<List<AccountDto>>> GetAll()
        {
            var user = await _utilities.GetCurrentUserAsync();

            var accountsDto = await _context.Accounts
                .Where(a => a.User == user)
                .Include(a => a.Currency)
                .Include(a => a.AccountBalances)
                .ProjectTo<AccountDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // przeliczenie salda do defaultowej waluty użytkownika
            foreach (var account in accountsDto)
                account.ConvertedBalance = _utilities
                    .ConvertToDefaultCurrency(user, account.Currency.Code, account.Balance);

            return Result<List<AccountDto>>.Success(accountsDto);
        }

        // funkcja tworząca konto
        public async Task<Result<AccountDto>> Create(AccountCreateDto newAccount)
        {
            var user = await _utilities.GetCurrentUserAsync();

            if (_utilities.CheckIfCurrencyExists(newAccount.CurrencyId))
                return Result<AccountDto>.Failure("Invalid currency id");

            var account = _mapper.Map<Account>(newAccount);

            account.User = user;
            account.AccountBalances = new List<AccountBalance>
            {
                new AccountBalance()
                {
                    Balance = newAccount.Balance,
                    Currency = _context.Currencies.Find(newAccount.CurrencyId)
                }
            };

            await _context.Accounts.AddAsync(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<AccountDto>.Failure("Failed to create account");

            var accountDto = _mapper.Map<AccountDto>(account);

            // przeliczenie salda do defaultowej waluty użytkownika
            accountDto.ConvertedBalance = _utilities
                .ConvertToDefaultCurrency(user, accountDto.Currency.Code, accountDto.Balance);

            return Result<AccountDto>.Success(accountDto);
        }

        // fukncja aktualizuje konto
        public async Task<Result<AccountDto>> Update(int accountId, AccountUpdateDto updatedAccount)
        {
            var account = _context.Accounts
                .Include(a => a.Currency)
                .Include(a => a.AccountBalances)
                .FirstOrDefault(c => c.Id == accountId);

            if (account == null) return null;

            updatedAccount.Name ??= account.Name;
            updatedAccount.Description ??= account.Description;
            
            _mapper.Map(updatedAccount, account);

            _context.Accounts.Update(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<AccountDto>.Failure("Failed to update account");

            var accountDto = _mapper.Map<AccountDto>(account);

            // przeliczenie salda do defaultowej waluty użytkownika
            accountDto.ConvertedBalance = _utilities
                .ConvertToDefaultCurrency(await _utilities.GetCurrentUserAsync(), accountDto.Currency.Code, accountDto.Balance);

            return Result<AccountDto>.Success(accountDto);
        }

        // funkcja zmienająca status konta
        public async Task<Result<object>> ChangeStatus(int accountId, AccountStatus newStatus)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(c => c.Id == accountId);

            if (account == null) return null;

            account.Status = newStatus;

            _context.Accounts.Update(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to change account status");

            return Result<object>.Success(null);
        }

        public async Task<Result<object>> Delete(int accountId, bool deleteRelatedTransactions)
        {
            var account = await _context.Accounts
                .Include(a => a.Transactions)
                .FirstOrDefaultAsync(c => c.Id == accountId);

            if (account == null) return null;

            if (deleteRelatedTransactions)
            {
                foreach (var transaction in account.Transactions)
                    _context.Transactions.Remove(transaction);
            }

            _context.Accounts.Remove(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete account");

            return Result<object>.Success(null);
        }
    }
}

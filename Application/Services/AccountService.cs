using Application.Core;
using Application.Dto.Account;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.Principal;

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

        public async Task<Result<AccountDto>> Get(int accountId)
        {
            var user = await _utilities.GetCurrentUserAsync();

            var accountDto = await _context.Accounts
                .Where(a => a.User == user)
                .Include(a => a.Currency)
                .Include(a => a.AccountBalances)
                .Include(l => l.Loans)
                .ProjectTo<AccountDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(a => a.Id == accountId);

            if (accountDto == null) return null;

            // przeliczenie salda do defaultowej waluty użytkownika
            accountDto.ConvertedBalance = await _utilities
                .Convert(accountDto.Currency.Code, user.DefaultCurrency.Code, accountDto.Balance);

            return Result<AccountDto>.Success(accountDto);
        }


        // funkcja zwraca liste wszytkich kont użytkownika 
        public async Task<Result<List<AccountDto>>> GetAll()
        {
            var user = await _utilities.GetCurrentUserAsync();

            var accountsDto = await _context.Accounts
                .Where(a => a.User == user)
                .Include(a => a.Currency)
                .Include(a => a.AccountBalances)
                .Include(a => a.Loans)
                .OrderByDescending(a => a.CreatedAt)
                .ProjectTo<AccountDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // przeliczenie salda do defaultowej waluty użytkownika
            foreach (var account in accountsDto)
                account.ConvertedBalance = await _utilities
                    .Convert(account.Currency.Code, user.DefaultCurrency.Code, account.Balance);

            return Result<List<AccountDto>>.Success(accountsDto);
        }

        // funkcja tworząca konto
        public async Task<Result<AccountDto>> Create(AccountCreateDto newAccount)
        {
            var user = await _utilities.GetCurrentUserAsync();

            if (_utilities.CheckIfCurrencyExists(newAccount.CurrencyId))
                return Result<AccountDto>.Failure("Invalid currency id");

            var existingAccount = await _context.Accounts
                .Where(a => a.User == user)
                .Where(a => a.Name == newAccount.Name && a.Currency.Id == newAccount.CurrencyId)
                .FirstOrDefaultAsync();

            if (existingAccount != null)
                return Result<AccountDto>.Failure("Account with the same name and currency already exist.");

            var account = _mapper.Map<Account>(newAccount);

            account.User = user;
            account.AccountBalances = new List<AccountBalance>
            {
                new AccountBalance()
                {
                    Balance = newAccount.Balance,
                    Date = newAccount.Date,
                    Currency = _context.Currencies.Find(newAccount.CurrencyId)
                }
            };
            account.Loans = new List<Loan>();

            await _context.Accounts.AddAsync(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<AccountDto>.Failure("Failed to create account");

            var accountDto = _mapper.Map<AccountDto>(account);

            // przeliczenie salda do defaultowej waluty użytkownika
            accountDto.ConvertedBalance = await _utilities
                .Convert(accountDto.Currency.Code, user.DefaultCurrency.Code, accountDto.Balance);

            return Result<AccountDto>.Success(accountDto);
        }

        // fukncja aktualizuje konto
        public async Task<Result<AccountDto>> Update(int accountId, AccountUpdateDto updatedAccount)
        {   
            var account = _context.Accounts
                .Include(a => a.Currency)
                .Include(a => a.AccountBalances)
                .Include(a => a.Loans)
                .FirstOrDefault(c => c.Id == accountId);

            if (account == null) return null;

            var user = await _utilities.GetCurrentUserAsync();

            var existingAccount = await _context.Accounts
                .Where(a => a.User == user)
                .Where(a => a.Name == updatedAccount.Name && a.Currency.Id == account.CurrencyId)
                .FirstOrDefaultAsync();

            if (existingAccount != null)
                return Result<AccountDto>.Failure("Account with the same name and currency already exist.");

            updatedAccount.Name ??= account.Name;
            updatedAccount.Description ??= account.Description;
            
            _mapper.Map(updatedAccount, account);

            _context.Accounts.Update(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<AccountDto>.Failure("Failed to update account");

            var accountDto = _mapper.Map<AccountDto>(account);

            // przeliczenie salda do defaultowej waluty użytkownika
            accountDto.ConvertedBalance = await _utilities
                .Convert(accountDto.Currency.Code, user.DefaultCurrency.Code, accountDto.Balance);

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
                .Include(a => a.Loans)
                .Include(a => a.Payoffs)
                .FirstOrDefaultAsync(c => c.Id == accountId);

            if (account == null) return null;

            if (account.Loans.Where(l => l.LoanStatus == LoanStatus.InProgress).Any())
                return Result<object>.Failure("The account cannot be deleted. Loans with InProgress status are assigned to it.");

            foreach (var transaction in account.Transactions)
            {
                if (deleteRelatedTransactions || transaction.Planned)
                    _context.Transactions.Remove(transaction);
            }

            _context.Accounts.Remove(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete account");

            return Result<object>.Success(null);
        }
    }
}

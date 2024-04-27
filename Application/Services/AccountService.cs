using Application.Core;
using Application.Dto.Account;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.Principal;

namespace Application.Services
{
    public class AccountService(
        DataContext context, 
        IUserAccessor userAccessor,
        ICurrencyService currencyService,
        IMapper mapper) : IAccountService
    {
        private readonly DataContext _context = context;
        private readonly IUserAccessor _userAccessor = userAccessor;
        private readonly ICurrencyService _currencyService = currencyService;
        private readonly IMapper _mapper = mapper;

        // funkcja zwraca liste wszytkich kont użytkownika 
        public async Task<Result<List<AccountDto>>> GetAll()
        {
            var user = await GetCurrentUserAsync();

            if (user == null) return Result<List<AccountDto>>.Failure("User not found");

            var accounts = await _context.Accounts
                .Where(a => a.User == user)
                .Include(a => a.Currency)
                .ToListAsync();

            var accountsDto = _mapper.Map<List<AccountDto>>(accounts);

            // przeliczenie salda do defaultowej waluty użytkownika
            foreach (var account in accountsDto)
                account.ConvertedBalance = ConvertedBalance(user, account);

            return Result<List<AccountDto>>.Success(accountsDto);
        }

        // funkcja tworząca konto
        public async Task<Result<AccountDto>> Create(AccountCreateDto newAccount)
        {
            var user = await GetCurrentUserAsync();

            if (user == null) return Result<AccountDto>.Failure("User not found");

            if (CheckIfCurrencyExists(newAccount.CurrencyId))
                return Result<AccountDto>.Failure("Invalid currency id");

            var account = _mapper.Map<Account>(newAccount);

            account.User = user;

            await _context.Accounts.AddAsync(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<AccountDto>.Failure("Failed to create account");

            var accountDto = _mapper.Map<AccountDto>(account);

            // przeliczenie salda do defaultowej waluty użytkownika
            accountDto.ConvertedBalance = ConvertedBalance(user, accountDto);

            return Result<AccountDto>.Success(accountDto);
        }

        // fukncja aktualizuje konto
        public async Task<Result<AccountDto>> Update(int accountId, AccountUpdateDto updatedAccount)
        {
            var account = _context.Accounts.FirstOrDefault(c => c.Id == accountId);

            if (account == null) return null;

            updatedAccount.Name ??= account.Name;
            updatedAccount.Description ??= account.Description;
            if (updatedAccount.CurrencyId == 0)
                updatedAccount.CurrencyId = account.CurrencyId;

            if (CheckIfCurrencyExists(updatedAccount.CurrencyId))
                return Result<AccountDto>.Failure("Invalid currency id");
            
            _mapper.Map(updatedAccount, account);

            _context.Accounts.Update(account);

            if (await _context.SaveChangesAsync() == 0)
                return Result<AccountDto>.Failure("Failed to update account");

            var accountDto = _mapper.Map<AccountDto>(account);

            // przeliczenie salda do defaultowej waluty użytkownika
            accountDto.ConvertedBalance = ConvertedBalance(await GetCurrentUserAsync(), accountDto);

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

        // zwraca użytkownika, który wywołał funkcje
        private async Task<User> GetCurrentUserAsync()
        {
            return await _context.Users
                .Include(u => u.DefaultCurrency)
                .FirstOrDefaultAsync(u => u.Email == _userAccessor.GetUserEmail());
        }

        // zwraca saldo konta w defaultowej walucie użytkownika
        private decimal ConvertedBalance(User user, AccountDto accountDto)
        {
            if (user.CurrencyId != accountDto.Currency.Id)
                return _currencyService.Convert(user.DefaultCurrency.Code, accountDto.Currency.Code, accountDto.Balance);
            else
                return accountDto.Balance;
        }

        private bool CheckIfCurrencyExists(int currencyId)
        {
            return _context.Currencies.FirstOrDefault(c => c.Id == currencyId) == null;
        }

        
    }
}

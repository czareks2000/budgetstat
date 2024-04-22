using Application.Core;
using Application.Dto;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

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
            var user = await _context.Users
                .Include(u => u.DefaultCurrency)
                .FirstOrDefaultAsync(u => u.Email == _userAccessor.GetUserEmail());

            if (user == null) return Result<List<AccountDto>>.Failure("User not found");

            var accounts = await _context.Accounts
                .Where(a => a.User == user)
                .Include(a => a.Currency)
                .ToListAsync();

            var accountsDto = _mapper.Map<List<AccountDto>>(accounts);

            // przeliczenie salda do defaultowej waluty użytkownika
            foreach (var account in accountsDto)
            {
                if(user.CurrencyId != account.Currency.Id)
                    account.ConvertedBalance = _currencyService.Convert(user.DefaultCurrency.Code, account.Currency.Code, account.Balance);
                else
                    account.ConvertedBalance = account.Balance;
            }

            return Result<List<AccountDto>>.Success(accountsDto);
        }
    }
}

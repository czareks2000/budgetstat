using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class Utilities(
        DataContext context,
        ICurrencyService currencyService,
        IUserAccessor userAccessor) : IUtilities
    {
        private readonly DataContext _context = context;
        private readonly ICurrencyService _currencyService = currencyService;
        private readonly IUserAccessor _userAccessor = userAccessor;

        // zwraca użytkownika, który wywołał funkcje
        public async Task<User> GetCurrentUserAsync()
        {
            return await _context.Users
                .Include(u => u.DefaultCurrency)
                .FirstOrDefaultAsync(u => u.Email == _userAccessor.GetUserEmail());
        }

        // zwraca kwotę w defaultowej walucie użytkownika
        public decimal ConvertToDefaultCurrency(User user, string inputCurrencyCode, decimal value)
        {
            if (user.DefaultCurrency.Code != inputCurrencyCode)
                return _currencyService.Convert(user.DefaultCurrency.Code, inputCurrencyCode, value);
            else
                return value;
        }

        // zwraca kwotę w podanej walucie
        public decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value)
        {
            if (inputCurrencyCode != outputCurrencyCode)
                return _currencyService.Convert(inputCurrencyCode, outputCurrencyCode, value);
            else
                return value;
        }

        public bool CheckIfCurrencyExists(int currencyId)
        {
            return _context.Currencies.FirstOrDefault(c => c.Id == currencyId) == null;
        }
    }
}

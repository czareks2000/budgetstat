using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class Utilities(
        DataContext context,
        ICurrencyRatesService currencyService,
        IUserAccessor userAccessor) : IUtilities
    {
        private readonly DataContext _context = context;
        private readonly ICurrencyRatesService _currencyService = currencyService;
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

        public bool UpdateAccountBalances(int accountId, DateTime newOperationDate, bool isExpense, decimal newOperationAmount)
        {
            var account = _context.Accounts
                .Include(a => a.Currency)
                .Include(a => a.AccountBalances)
                .FirstOrDefault(a => a.Id == accountId);

            // pobieramy saldo konta z najbliższego dnia przed datą nowej transakcji
            // (lub jeżeli jest to z tego samego dnia co nowa transakcja)
            var accountBalance = account.AccountBalances
                .Where(ab => ab.Date.Date <= newOperationDate)
                .OrderByDescending(ab => ab.Date)
                .FirstOrDefault();

            // jeżeli nie znaleziono salda spełnającego warunki to brane jest najstarsze saldo
            accountBalance ??= account.AccountBalances.OrderBy(ab => ab.Date).FirstOrDefault();

            // sprawdzenie czy są wstarczające środki na koncie
            if (isExpense && accountBalance.Balance < newOperationAmount)
                return false;

            // Aktualizacja sald
            foreach (var ab in account.AccountBalances.OrderByDescending(ab => ab.Date))
            {
                if (ab.Date.Date < newOperationDate)
                    break;

                if (isExpense)
                    ab.Balance -= newOperationAmount;
                else
                    ab.Balance += newOperationAmount;
            }

            // Jeżeli nie istnieje saldo z tą samą datą, tworzymy nowy obiekt AccountBalance
            if (!account.AccountBalances.Any(ab => ab.Date.Date == newOperationDate))
            {
                // Tworzenie nowego obiektu AccountBalance z datą newOperationDate
                var newAccountBalance = new AccountBalance
                {
                    Date = newOperationDate,
                    Account = account,
                    Currency = account.Currency,
                };

                if (newOperationDate < accountBalance.Date.Date)
                    newAccountBalance.Balance = accountBalance.Balance;
                else
                    newAccountBalance.Balance = isExpense
                        ? accountBalance.Balance - newOperationAmount
                        : accountBalance.Balance + newOperationAmount;

                _context.AccountBalances.Add(newAccountBalance);
            }

            return true;
        }

        public void RestoreAccountBalances(int accountId, bool wasExpense, decimal amount, DateTime date)
        {
            var accountBalances = _context.AccountBalances
                .Where(ab => ab.AccountId == accountId)
                .OrderByDescending(ab => ab.Date).ToList();

            if (accountBalances.Count == 0)
                return;

            foreach (var ab in accountBalances)
            {
                if (ab.Date.Date < date.Date)
                    break;

                if (wasExpense)
                    ab.Balance += amount;
                else
                    ab.Balance -= amount;
            }
        }
    }
}

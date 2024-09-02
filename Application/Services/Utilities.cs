using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        // zwraca kwotę w podanej walucie
        public async Task<decimal> Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value)
        {
            if (outputCurrencyCode == inputCurrencyCode)
                return value;

            decimal? currentRate = GetRateFromDatabase(inputCurrencyCode, outputCurrencyCode, DateTime.UtcNow);

            if (currentRate.HasValue)
                return value * currentRate.Value;

            // get current rate and save to database
            currentRate = await _currencyService.CurrentRate(inputCurrencyCode, outputCurrencyCode);

            if (currentRate.Value != 1)
                await SaveRateToDatabase(inputCurrencyCode, outputCurrencyCode, DateTime.UtcNow, currentRate.Value);
            else
                currentRate = GetLatestsRateFromDatabase(inputCurrencyCode, outputCurrencyCode, DateTime.UtcNow);

            if (currentRate.HasValue)
                return value * currentRate.Value;

            return value;
        }

        // zwraca kwotę w podanej walucie (historyczny kurs)
        public async Task<decimal> Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value, DateTime date)
        {
            // If the provided date is in the future, change it to the current UTC date
            if (date > DateTime.UtcNow)
                date = DateTime.UtcNow;

            if (outputCurrencyCode == inputCurrencyCode)
                return value;

            decimal? historicRate = GetRateFromDatabase(inputCurrencyCode, outputCurrencyCode, date);

            if (historicRate.HasValue)
                return value * historicRate.Value;

            // get historic rate and save to database
            historicRate = await _currencyService.HistoricRate(inputCurrencyCode, outputCurrencyCode, date);

            if (historicRate.Value != 1)
                await SaveRateToDatabase(inputCurrencyCode, outputCurrencyCode, date, historicRate.Value);
            else
                historicRate = GetLatestsRateFromDatabase(inputCurrencyCode, outputCurrencyCode, date);

            if (historicRate.HasValue)
                return value * historicRate.Value;

            return value;
        }

        // zwraca aktualny kurs
        public async Task<decimal> GetCurrentRate(string inputCurrencyCode, string outputCurrencyCode)
        {
            if (inputCurrencyCode == outputCurrencyCode)
                return 1;

            decimal? currentRate = GetRateFromDatabase(inputCurrencyCode, outputCurrencyCode, DateTime.UtcNow);

            if (currentRate.HasValue)
                return currentRate.Value;

            // get current rate and save to database
            currentRate = await _currencyService.CurrentRate(inputCurrencyCode, outputCurrencyCode);

            if (currentRate.Value != 1)
                await SaveRateToDatabase(inputCurrencyCode, outputCurrencyCode, DateTime.UtcNow, currentRate.Value);
            else
                currentRate = GetLatestsRateFromDatabase(inputCurrencyCode, outputCurrencyCode, DateTime.UtcNow);

            if (currentRate.HasValue)
                return currentRate.Value;

            return 1;
        }

        private async Task<bool> SaveRateToDatabase(string inputCurrencyCode, string outputCurrencyCode, DateTime date, decimal rate)
        {
            if (rate == 1) return false;

            try
            {
                var exchangeRate = new ExchangeRate
                {
                    InputCurrencyCode = inputCurrencyCode.ToLower(),
                    OutputCurrencyCode = outputCurrencyCode.ToLower(),
                    Rate = rate,
                    Date = date.Date
                };

                _context.ExchangeRates.Add(exchangeRate);
                return await _context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex)
            {
                // Check if the exception is due to the unique constraint violation
                if (ex.InnerException != null && ex.InnerException.Message.Contains("unique"))
                {
                    return false;
                }
                throw;
            }
        }

        private decimal? GetRateFromDatabase(string inputCurrencyCode, string outputCurrencyCode, DateTime date)
        {
            var exchangeRate = _context.ExchangeRates
                .Where(er => er.InputCurrencyCode.ToLower() == inputCurrencyCode.ToLower())
                .Where(er => er.OutputCurrencyCode.ToLower() == outputCurrencyCode.ToLower())
                .Where(er => er.Date.Date == date.Date)
                .Select(er => (decimal?)er.Rate)
                .FirstOrDefault();

            if (exchangeRate == null) 
            {
                exchangeRate = _context.ExchangeRates
                    .Where(er => er.InputCurrencyCode.ToLower() == outputCurrencyCode.ToLower())
                    .Where(er => er.OutputCurrencyCode.ToLower() == inputCurrencyCode.ToLower())
                    .Where(er => er.Date.Date == date.Date)
                    .Select(er => (decimal?)er.Rate)
                    .FirstOrDefault();

                if (exchangeRate != null)
                    exchangeRate = 1 / exchangeRate;
            }

            return exchangeRate;
        }

        private decimal? GetLatestsRateFromDatabase(string inputCurrencyCode, string outputCurrencyCode, DateTime date)
        {
            var exchangeRate = _context.ExchangeRates
                .Where(er => er.InputCurrencyCode.ToLower() == inputCurrencyCode.ToLower())
                .Where(er => er.OutputCurrencyCode.ToLower() == outputCurrencyCode.ToLower())
                .Where(er => er.Date.Date <= date.Date)
                .Select(er => (decimal?)er.Rate)
                .FirstOrDefault();

            if (exchangeRate == null)
            {
                exchangeRate = _context.ExchangeRates
                    .Where(er => er.InputCurrencyCode.ToLower() == outputCurrencyCode.ToLower())
                    .Where(er => er.OutputCurrencyCode.ToLower() == inputCurrencyCode.ToLower())
                    .Where(er => er.Date.Date <= date.Date)
                    .Select(er => (decimal?)er.Rate)
                    .FirstOrDefault();

                if (exchangeRate != null)
                    exchangeRate = 1 / exchangeRate;
            }

            return exchangeRate;
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
                if (ab.Date.Date < newOperationDate.Date)
                    break;

                if (isExpense)
                    ab.Balance -= newOperationAmount;
                else
                    ab.Balance += newOperationAmount;
            }

            // Jeżeli nie istnieje saldo z tą samą datą, tworzymy nowy obiekt AccountBalance
            if (!account.AccountBalances.Any(ab => ab.Date.Date == newOperationDate.Date))
            {
                // Tworzenie nowego obiektu AccountBalance z datą newOperationDate
                var newAccountBalance = new AccountBalance
                {
                    Date = newOperationDate.Date,
                    Account = account,
                    Currency = account.Currency,
                };

                if (newOperationDate.Date < accountBalance.Date.Date)
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

using Domain;
using Persistence;

namespace Application.Interfaces
{
    public interface IUtilities
    {
        Task<User> GetCurrentUserAsync();
        Task<decimal> Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value);
        Task<decimal> Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value, DateTime date);
        Task<decimal> GetCurrentRate(string inputCurrencyCode, string outputCurrencyCode);
        bool CheckIfCurrencyExists(int currencyId);
        bool UpdateAccountBalances(int accountId, DateTime newOperationDate, bool isExpense, decimal newOperationAmount);
        void RestoreAccountBalances(int accountId, bool wasExpense, decimal amount, DateTime date);
    }
}

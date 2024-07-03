using Domain;
using Persistence;

namespace Application.Interfaces
{
    public interface IUtilities
    {
        Task<User> GetCurrentUserAsync();
        decimal ConvertToDefaultCurrency(User user, string inputCurrencyCode, decimal value);
        decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value);
        bool CheckIfCurrencyExists(int currencyId);
        bool UpdateAccountBalances(int accountId, DateTime newOperationDate, bool isExpense, decimal newOperationAmount);
        void RestoreAccountBalances(int accountId, bool wasExpense, decimal amount, DateTime date);
    }
}

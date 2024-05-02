using Domain;

namespace Application.Interfaces
{
    public interface IUtilities
    {
        Task<User> GetCurrentUserAsync();
        decimal ConvertToDefaultCurrency(User user, string inputCurrencyCode, decimal value);
        bool CheckIfCurrencyExists(int currencyId);
    }
}

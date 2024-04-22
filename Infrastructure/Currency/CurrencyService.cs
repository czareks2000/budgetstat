using Application.Interfaces;

namespace Infrastructure.Currency
{
    public class CurrencyService : ICurrencyService
    {
        public decimal Convert(string inputCurrency, string outputCurrency, decimal value)
        {
            return value;
        }
    }
}

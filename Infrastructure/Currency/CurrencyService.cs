using Application.Interfaces;

namespace Infrastructure.Currency
{
    public class CurrencyService : ICurrencyService
    {
        public decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value)
        {
            return value + 10;
        }

        public decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value, DateTime date)
        {
            return value + 10;
        }
    }
}

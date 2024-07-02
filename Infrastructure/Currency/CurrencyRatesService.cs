using Application.Interfaces;

namespace Infrastructure.Currency
{
    public class CurrencyRatesService : ICurrencyRatesService
    {
        public decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value)
        {
            return value + 10;
        }

        public decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value, DateTime date)
        {
            return value + 10;
        }

        public decimal CurrentRate(string inputCurrencyCode, string outputCurrencyCode)
        {
            return 1;
        }
    }
}

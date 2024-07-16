using Application.Interfaces;
using System.Text.Json;

namespace Infrastructure.Currency
{
    public class CurrencyRatesService : ICurrencyRatesService
    {
        private static string apiVersion = "v1";

        private static CurrencyRates _currencyRates = new CurrencyRates();

        private static string[] fallbackUrls = new[]
        {
            $"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/{apiVersion}/currencies/usd.min.json",
            $"https://latest.currency-api.pages.dev/{apiVersion}/currencies/usd.min.json",
            $"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/{apiVersion}/currencies/usd.json",
            $"https://latest.currency-api.pages.dev/{apiVersion}/currencies/usd.json"
        };

        public async Task<decimal> Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value)
        {
            _currencyRates = await GetCurrencyRates(DateTime.UtcNow);

            return ConvertAmount(inputCurrencyCode, outputCurrencyCode, value);
        }

        public async Task<decimal> Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value, DateTime date)
        {
            _currencyRates = await GetCurrencyRates(date);

            return ConvertAmount(inputCurrencyCode, outputCurrencyCode, value);
        }

        public async Task<decimal> CurrentRate(string inputCurrencyCode, string outputCurrencyCode)
        {
            _currencyRates = await GetCurrencyRates(DateTime.UtcNow);
            
            decimal fromRate = _currencyRates.Usd[inputCurrencyCode.ToLower()];
            decimal toRate = _currencyRates.Usd[outputCurrencyCode.ToLower()];

            return toRate / fromRate;
        }

        private static string CreateUrl(string fallbackUrl, string date = "latest")
        {
            return fallbackUrl.Replace("latest", date);
        }

        private string FormatDate(DateTime date)
        {
            return date.ToString("yyyy-MM-dd");
        }

        private async Task<CurrencyRates> GetCurrencyRates(DateTime date)
        {
            string formattedDate = FormatDate(date);

            string url = "";

            HttpClient client = new HttpClient();

            foreach (var fallbackUrl in fallbackUrls)
            {
                if (date.Date == DateTime.UtcNow.Date)
                    url = fallbackUrl;
                else
                    url = CreateUrl(fallbackUrl, formattedDate);

                try
                {
                    var response = await client.GetAsync(url);

                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        return JsonSerializer.Deserialize<CurrencyRates>(json);
                    }
                }
                catch (Exception) { }
            }

            return new CurrencyRates(FormatDate(date));
        }

        private static decimal ConvertAmount(string inputCurrencyCode, string outputCurrencyCode, decimal value)
        {
            decimal fromRate = _currencyRates.Usd[inputCurrencyCode.ToLower()];
            decimal toRate = _currencyRates.Usd[outputCurrencyCode.ToLower()];

            decimal convertedAmount = value * (toRate / fromRate);

            return Math.Round(convertedAmount, 2);
        }
    }
}

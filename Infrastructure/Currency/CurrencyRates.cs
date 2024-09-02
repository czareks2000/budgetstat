using System.Text.Json.Serialization;

namespace Infrastructure.Currency
{
    public class CurrencyRates
    {
        [JsonPropertyName("date")]
        public string Date { get; set; }
        [JsonPropertyName("usd")]
        public Dictionary<string, decimal> Usd { get; set; }

        public CurrencyRates() { }

        public CurrencyRates(string date)
        {
            Date = date;

            Usd = new Dictionary<string, decimal>
            {
                { "pln", 1m },
                { "eur", 1m },
                { "usd", 1m },
                { "gbp", 1m },
                { "chf", 1m },
                { "jpy", 1m },
                { "czk", 1m },
                { "cad", 1m },
                { "sek", 1m }
            };
        }
    }
}

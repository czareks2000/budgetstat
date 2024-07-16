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
                { "pln", 3.90830404m },
                { "eur", 0.91843178m },
                { "usd", 1m }
            };
        }
    }
}

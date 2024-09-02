using System.Text.Json.Serialization;

namespace Infrastructure.Currency
{
    public class ApiResponseNBP
    {
        [JsonPropertyName("table")]
        public string Table { get; set; }
        [JsonPropertyName("currency")]
        public string Currency { get; set; }
        [JsonPropertyName("code")]
        public string Code { get; set; }
        [JsonPropertyName("rates")]
        public List<Rates> Rates { get; set; }
    }

    public class Rates
    {
        [JsonPropertyName("no")]
        public string No { get; set; }
        [JsonPropertyName("effectiveDate")]
        public string EffectiveDate { get; set; }
        [JsonPropertyName("mid")]
        public decimal Mid { get; set; }
    }
}

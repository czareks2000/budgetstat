namespace Application.Interfaces
{
    public interface ICurrencyRatesService
    {
        // konwersja waluty po aktualnym kursie
        Task<decimal> Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value);
        // konwersja waluty po kursie historycznym
        Task<decimal> Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value, DateTime date);
        // aktualny kurs danej waluty
        Task<decimal> CurrentRate(string inputCurrencyCode, string outputCurrencyCode);
        // historyczny kurs danej waluty
        Task<decimal> HistoricRate(string inputCurrencyCode, string outputCurrencyCode, DateTime date);
    }
}

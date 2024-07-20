namespace Application.Interfaces
{
    public interface ICurrencyRatesService
    {
        // aktualny kurs danej waluty
        Task<decimal> CurrentRate(string inputCurrencyCode, string outputCurrencyCode);
        // historyczny kurs danej waluty
        Task<decimal> HistoricRate(string inputCurrencyCode, string outputCurrencyCode, DateTime date);
    }
}

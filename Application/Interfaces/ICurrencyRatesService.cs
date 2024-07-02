namespace Application.Interfaces
{
    public interface ICurrencyRatesService
    {
        // konwersja waluty po aktualnym kursie
        decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value);
        // konwersja waluty po kursie historycznym
        decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value, DateTime date);
        // aktualny kurs danej waluty
        decimal CurrentRate(string inputCurrencyCode, string outputCurrencyCode);
    }
}

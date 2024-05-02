namespace Application.Interfaces
{
    public interface ICurrencyService
    {
        // konwersja waluty po aktualnym kursie
        decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value);
        // konwersja waluty po kursie historycznym
        decimal Convert(string inputCurrencyCode, string outputCurrencyCode, decimal value, DateTime date);
    }
}

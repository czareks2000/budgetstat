namespace Application.Interfaces
{
    public interface ICurrencyService
    {
        decimal Convert(string inputCurrency, string outputCurrency, decimal value);
    }
}

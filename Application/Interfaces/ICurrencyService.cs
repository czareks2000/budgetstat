using Application.Core;
using Application.Dto.Currency;

namespace Application.Interfaces
{
    public interface ICurrencyService
    {
        Task<Result<List<CurrencyDto>>> GetAll();
        Task<Result<decimal>> GetCurrentExchangeRate(string inputCurrencyCode, string outputCurrencyCode);
    }
}

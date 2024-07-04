using Application.Core;
using Application.Dto.Currency;

namespace Application.Interfaces
{
    public interface ICurrencyService
    {
        Task<Result<List<CurrencyDto>>> GetAll();
    }
}

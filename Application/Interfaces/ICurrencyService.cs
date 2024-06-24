using Application.Core;
using Application.Dto;

namespace Application.Interfaces
{
    public interface ICurrencyService
    {
        Task<Result<List<CurrencyDto>>> GetAll();
    }
}

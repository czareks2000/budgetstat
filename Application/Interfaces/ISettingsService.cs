using Application.Core;
using Application.Dto.Currency;

namespace Application.Interfaces
{
    public interface ISettingsService
    {
        //zmiana domyślnej waluty
        Task<Result<CurrencyDto>> SetDefaultCurrency(int currencyId);
    }
}

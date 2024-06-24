using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CurrencyController(
        ICurrencyService currencyService) : BaseApiController
    {
        private readonly ICurrencyService _currencyService = currencyService;

        [HttpGet("currencies")] //api/currencies
        public async Task<IActionResult> GetCurrencies()
        {
            return HandleResult(await _currencyService.GetAll());
        }
    }
}

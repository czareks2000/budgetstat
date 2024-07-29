using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CurrencyController(
        ICurrencyService currencyService) : BaseApiController
    {
        private readonly ICurrencyService _currencyService = currencyService;

        [AllowAnonymous]
        [HttpGet("currencies")] //api/currencies
        public async Task<IActionResult> GetCurrencies()
        {
            return HandleResult(await _currencyService.GetAll());
        }

        [HttpGet("exchangerate/{inputCurrencyCode}/{outputCurrencyCode}")] //api/exchangerate/{inputCurrencyCode}/{outputCurrencyCode}
        public async Task<IActionResult> GetExchangeRate(string inputCurrencyCode, string outputCurrencyCode)
        {
            return HandleResult(await _currencyService.GetCurrentExchangeRate(inputCurrencyCode, outputCurrencyCode));
        }
    }
}

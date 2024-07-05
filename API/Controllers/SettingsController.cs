using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SettingsController(
        ISettingsService settingsService) : BaseApiController
    {
        private readonly ISettingsService _settingsService = settingsService;

        [HttpPatch("settings")] //api/settings?defaultCurrency=1
        public async Task<IActionResult> SetDefaultCurrency([FromQuery] int defaultCurrency)
        {
            return HandleResult(await _settingsService.SetDefaultCurrency(defaultCurrency));
        }
    }
}

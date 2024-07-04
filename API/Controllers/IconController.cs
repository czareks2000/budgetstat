using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class IconController(
        IIconService iconService) : BaseApiController
    {
        private readonly IIconService _iconService = iconService;

        [HttpGet("icons")] //api/icons
        public async Task<IActionResult> GetIcons()
        {
            return HandleResult(await _iconService.GetIcons());
        }
    }
}

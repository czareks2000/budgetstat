using Application.Interfaces;

namespace API.Controllers
{
    public class StatsController(
        ISettingsService statsService) : BaseApiController
    {
        private readonly ISettingsService _statsService = statsService;

    }
}

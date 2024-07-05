using Application.Interfaces;

namespace API.Controllers
{
    public class StatsController(
        IStatsService statsService) : BaseApiController
    {
        private readonly IStatsService _statsService = statsService;

    }
}

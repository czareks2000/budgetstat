using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class StatsController(
        IStatsService statsService) : BaseApiController
    {
        private readonly IStatsService _statsService = statsService;

        [HttpGet("stats/networthstats")] //api/stats/networthstats
        public async Task<IActionResult> GetNetWorthStats([FromQuery] bool loans = true, bool assets = true)
        {
            return HandleResult(await _statsService.GetNetWorthStats(loans, assets));
        }
    }
}

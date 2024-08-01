using Application.Dto.Stats;
using Application.Dto.Stats.Enums;
using Application.Interfaces;
using Domain.Enums;
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

        [HttpGet("stats/networthovertime/{period}")] //api/stats/networthovertime/{period}
        public async Task<IActionResult> GetNetWorthValueOverTime(NetWorthChartPeriod period)
        {
            return HandleResult(await _statsService.GetNetWorthValueOverTime(period));
        }

        [HttpGet("stats/balanceovertime/{period}")] //api/stats/balanceovertime/{period}
        public async Task<IActionResult> GetAccountBalanceValueOverTime(
            ChartPeriod period, [FromQuery] List<int> accountIds, [FromQuery] TimeWindow customWindow)
        {
            return HandleResult(await _statsService.GetAccountBalanceValueOverTime(period, accountIds, customWindow));
        }

        [HttpGet("stats/incomesandexpensesovertime/{period}")] //api/stats/incomesandexpensesovertime
        public async Task<IActionResult> GetIncomesAndExpensesOverTime(
            ExtendedChartPeriod period, [FromQuery] DateTime customDate,
            [FromQuery] List<int> incomeCategoryIds, [FromQuery] List<int> expenseCategoryIds,
            [FromQuery] List<int> accountIds)
        {
            return HandleResult(
                await _statsService.GetIncomesAndExpensesOverTime(
                    period, accountIds, customDate, incomeCategoryIds, expenseCategoryIds));
        }

        [HttpGet("stats/avgmonthlytransactionsvalues/{period}")] //api/stats/avgmonthlytransactionsvalues
        public async Task<IActionResult> GetAvgMonthlyTransactionsValuesByCategories(
            AvgChartPeriod period, [FromQuery] TransactionType transactionType,
            [FromQuery] TimeWindow customWindow, [FromQuery] CategoryType categoryType, 
            [FromQuery] int mainCategoryId, [FromQuery] List<int> accountIds)
        {
            return HandleResult(
                await _statsService.GetAvgMonthlyTransactionsValuesByCategories(
                    transactionType, period, customWindow, categoryType, mainCategoryId, accountIds));
        }

        [HttpGet("stats/balanceovertimeforecast/{period}")] //api/stats/avgmonthlytransactionsvalues
        public async Task<IActionResult> GetAccountBalanceValueForecast(ForecastPeriod period, [FromQuery] List<int> accountIds)
        {
            return HandleResult(
                await _statsService.GetAccountBalanceValueForecast(period, accountIds));
        }

        [HttpGet("stats/currentmonthincome")] //api/stats/currentmonthincome
        public async Task<IActionResult> GetCurrentMonthIncome()
        {
            return HandleResult(await _statsService.GetCurrentMonthIncome());
        }

        [HttpGet("stats/avgmonthlyincomesandexpenseslastyear")] //api/stats/avgmonthlyincomesandexpenseslastyear
        public async Task<IActionResult> GetAvgMonthlyIncomesAndExpensesLastYear()
        {
            return HandleResult(await _statsService.GetAvgMonthlyIncomesAndExpensesLastYear());
        }

    }
}

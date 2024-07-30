using Application.Core;
using Application.Dto.Stats;
using Application.Dto.Stats.Enums;
using Domain.Enums;

namespace Application.Interfaces
{
    // wszystkie kwoty są w domyślnej walucie
    public interface IStatsService
    {
        // porównanie aktulanego salda do poprzedniego miesiąca
        Task<Result<decimal>> GetCurrentMonthIncome();

        // historia sald kont
        Task<Result<ValueOverTime>> GetAccountBalanceValueOverTime(
            ChartPeriod period, List<int> accountIds, TimeWindow customWindow);

        // średnie wartości transakcji
        Task<Result<List<LabelValueItem>>> GetAvgMonthlyTransactionsValuesByCategories(
            TransactionType transactionType, AvgChartPeriod period, TimeWindow customWindow,
            CategoryType categoryType, int mainCategoryId, List<int> accountIds);

        // suma wartości transakcji
        Task<Result<List<IncomesAndExpensesDataSetItem>>> GetIncomesAndExpensesOverTime(
            ExtendedChartPeriod period, List<int> accountIds, DateTime customDate,
            List<int> incomeCategoryIds, List<int> expenseCategoryIds);

        // prognoza salda kont
        Task<Result<ValueOverTime>> GetAccountBalanceValueForecast(ForecastPeriod period, List<int> accountIds);

        // historia wartości netto
        Task<Result<ValueOverTime>> GetNetWorthValueOverTime(NetWorthChartPeriod period);

        // aktualna suma wartości aktywów/pasywów
        Task<Result<NetWorthStats>> GetNetWorthStats(bool loans = true, bool assets = true);
    }
}

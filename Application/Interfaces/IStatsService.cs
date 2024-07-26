using Application.Core;
using Application.Dto.Stats;
using Application.Dto.Stats.Periods;

namespace Application.Interfaces
{
    // wszystkie kwoty są w domyślnej walucie
    public interface IStatsService
    {
        // porównanie aktulanego salda do poprzedniego miesiąca
        Task<Result<decimal>> GetCurrentMonthIncome();

        // historia sald kont
        Task<Result<BaseValueOverTime>> GetAccountBalanceValueOverTime(NetWorthChartPeriod period);

        // przepływy gotówki w czasie

        // średnie wartości transakcji 

        // suma wartości transakcji

        // prognoza salda kont

        // historia wartości netto
        Task<Result<BaseValueOverTime>> GetNetWorthValueOverTime(NetWorthChartPeriod period);

        // aktualna suma wartości aktywów/pasywów
        Task<Result<NetWorthStats>> GetNetWorthStats(bool loans = true, bool assets = true);
    }
}

using Application.Dto.Stats.Periods;

namespace Application.Dto.Stats
{
    public class NetWorthValueOverTime : BaseValueOverTime
    {
        public NetWorthChartPeriod Period { get; set; }
    }
}

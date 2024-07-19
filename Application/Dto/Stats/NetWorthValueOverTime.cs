namespace Application.Dto.Stats
{
    public class NetWorthValueOverTime
    {
        public List<decimal> Data { get; set; }
        public List<string> Labels { get; set; }
        public ChartPeriod Period { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class TimeWindow
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

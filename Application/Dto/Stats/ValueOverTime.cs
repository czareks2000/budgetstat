namespace Application.Dto.Stats
{
    public class ValueOverTime
    {
        public List<decimal> Data { get; set; }
        public List<string> Labels { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

namespace Domain
{
    public class AssetValue
    {
        public int Id { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int CurrencyId { get; set; }
        public int AssetId { get; set; }

        public virtual Currency Currency { get; set; }
        public virtual Asset Asset { get; set; }
    }
}

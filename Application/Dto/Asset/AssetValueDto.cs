namespace Application.Dto.Asset
{
    public class AssetValueDto
    {
        public int Id { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        public int CurrencyId { get; set; }
    }
}

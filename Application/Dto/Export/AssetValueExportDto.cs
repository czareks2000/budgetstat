namespace Application.Dto.Export
{
    public class AssetValueExportDto
    {
        public int Id { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        public string Currency { get; set; }
        public int AssetId { get; set; }
    }
}

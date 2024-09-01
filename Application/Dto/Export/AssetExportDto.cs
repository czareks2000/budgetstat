namespace Application.Dto.Export
{
    public class AssetExportDto
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Value { get; set; }
        public string Currency { get; set; }
        public DateTime ValueDate { get; set; }
    }
}

namespace Application.Dto.Asset
{
    public class AssetDto
    {
        public int Id { get; set; }
        public int AssetCategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal AssetValue { get; set; }
        public int CurrencyId { get; set; }
    }
}

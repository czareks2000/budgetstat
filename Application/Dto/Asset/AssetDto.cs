namespace Application.Dto.Asset
{
    public class AssetDto
    {
        public int Id { get; set; }
        public int AssetCategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<AssetValueDto> AssetValues { get; set; }
        public int CurrencyId { get; set; }
    }
}

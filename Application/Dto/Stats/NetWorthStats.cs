namespace Application.Dto.Stats
{
    public class NetWorthStats
    {
        public decimal LoansValue { get; set; }
        public List<AssetsCategoryValue> AssetsValues { get; set; }
    }

    public class AssetsCategoryValue
    {
        public int AssetCategoryId { get; set; }
        public decimal Value { get; set; }
    }
}

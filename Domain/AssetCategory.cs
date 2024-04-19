namespace Domain
{
    public class AssetCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }

        public virtual ICollection<Asset> Assets { get; set; }
    }
}
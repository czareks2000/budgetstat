namespace Domain
{
    public class AssetCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int IconId { get; set; }

        public virtual Icon Icon { get; set; }
        public virtual ICollection<Asset> Assets { get; set; }
    }
}
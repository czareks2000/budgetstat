namespace Domain
{
    public class Icon
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Category> Categories { get; set; }
        public virtual ICollection<AssetCategory> AssetCategories { get; set; }
    }
}

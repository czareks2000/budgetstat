﻿namespace Domain
{
    public class Asset
    {
        public int Id { get; set; }
        public int AssetCategoryId { get; set; }
        public string Name { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }

        public virtual User User { get; set; }
        public virtual AssetCategory AssetCategory { get; set; }
    }
}

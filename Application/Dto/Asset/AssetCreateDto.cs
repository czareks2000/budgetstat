using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Asset
{
    public class AssetCreateDto
    {
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid category id")]
        public int AssetCategoryId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        [GreaterOrEqualToZero(ErrorMessage = "Asset value cannot be negative")]
        public decimal AssetValue { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid currency id")]
        public int CurrencyId { get; set; }
    }
}

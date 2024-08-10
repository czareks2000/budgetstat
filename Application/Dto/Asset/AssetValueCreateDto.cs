using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Asset
{
    public class AssetValueCreateDto
    {
        [Required]
        [GreaterOrEqualToZero(ErrorMessage = "Asset value cannot be negative")]
        public decimal Value { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid currency id")]
        public int CurrencyId { get; set; }
    }
}

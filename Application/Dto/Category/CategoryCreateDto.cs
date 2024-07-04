using Application.Core.CustomDataAnnotations;
using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Category
{
    public class CategoryCreateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid icon id")]
        public int IconId { get; set; }
        [Required]
        [EnumDataType(typeof(TransactionType), ErrorMessage = "TransactionType is empty or invalid")]
        public TransactionType Type { get; set; }
        [Required]
        public bool IsMain { get; set; }
        public int? MainCategoryId { get; set; }
    }
}

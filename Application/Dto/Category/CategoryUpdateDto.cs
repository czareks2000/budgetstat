using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Category
{
    public class CategoryUpdateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid icon id")]
        public int IconId { get; set; }
    }
}

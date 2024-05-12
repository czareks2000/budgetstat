using Application.Core.CustomDataAnnotations;
using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Budget
{
    public class BudgetCreateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [MinLength(1, ErrorMessage = "CategoryIds list cannot be empty")]
        public List<int> CategoryIds { get; set; }
        [Required]
        [EnumDataType(typeof(BudgetPeriod), ErrorMessage = "Period is empty or invalid")]
        public BudgetPeriod Period { get; set; }
        [Required]
        [GreaterThanZeroOrNull(ErrorMessage = "The amount must be positive")]
        public decimal Amount { get; set; }
    }
}

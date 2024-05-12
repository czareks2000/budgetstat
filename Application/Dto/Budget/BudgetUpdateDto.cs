using Application.Core.CustomDataAnnotations;
using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Budget
{
    public class BudgetUpdateDto
    {
        public string Name { get; set; }
        [MinLength(1, ErrorMessage = "CategoryIds list cannot be empty")]
        public List<int> CategoryIds { get; set; }
        [EnumDataType(typeof(BudgetPeriod), ErrorMessage = "Period is invalid")]
        public BudgetPeriod? Period { get; set; }
        [GreaterThanZeroOrNull(ErrorMessage = "The amount must be positive")]
        public decimal? Amount { get; set; }
    }
}

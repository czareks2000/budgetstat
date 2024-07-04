using Application.Dto.Category;
using Application.Dto.Currency;
using Domain.Enums;

namespace Application.Dto.Budget
{
    public class BudgetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public BudgetPeriod Period { get; set; }
        public decimal Amount { get; set; } // wartość budżetu w pierwotniej walucie
        public decimal CurrentAmount { get; set; } // aktualna wartość budżetu w domyślniej walucie
        public decimal ConvertedAmount { get; set; } // wartość budżetu w domyślniej walucie
        public CurrencyDto Currency { get; set; }
        public List<CategoryDto> Categories { get; set; }
    }
}

using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Domain
{
    public class Budget
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public BudgetPeriod Period { get; set; } = BudgetPeriod.Month;
        [Precision(18, 2)]
        public decimal Amount { get; set; }
        public string UserId { get; set; }
        public int CurrencyId { get; set; }

        public virtual User User { get; set; }
        public virtual Currency Currency { get; set; }
        public virtual ICollection<BudgetCategory> Categories { get; set; }
    }
}

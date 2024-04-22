using Domain.Enums;

namespace Domain
{
    public class Budget
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public BudgetPeriod Period { get; set; } = BudgetPeriod.Month;
        public decimal Amount { get; set; }
        public string UserId { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<BudgetCategory> Categories { get; set; }
    }
}

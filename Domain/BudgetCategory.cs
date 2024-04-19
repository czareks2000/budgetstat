namespace Domain
{
    public class BudgetCategory
    {
        public int BudgetId { get; set; }
        public int CategoryId { get; set; }

        public virtual Budget Budget { get; set; }
        public virtual Category Category { get; set; }
    }
}

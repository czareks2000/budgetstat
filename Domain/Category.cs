namespace Domain
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public TransactionType Type { get; set; }
        public bool IsMain { get; set; }
        public int? MainCategoryId { get; set; }
        public string UserId { get; set; }

        public virtual Category MainCategory { get; set; }
        public virtual ICollection<Category> Categories { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ICollection<BudgetCategory> Budgets { get; set; }
    }
}

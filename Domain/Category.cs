namespace Domain
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int IconId { get; set; }
        public TransactionType Type { get; set; }
        public bool IsMain { get; set; } = false;
        public int? MainCategoryId { get; set; }
        public string UserId { get; set; }
        
        public virtual Icon Icon { get; set; }
        public virtual User User { get; set; }
        public virtual Category MainCategory { get; set; }
        public virtual ICollection<Category> SubCategories { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ICollection<BudgetCategory> Budgets { get; set; }
    }
}

using Domain.Enums;

namespace Application.Dto.Transaction
{
    public class TransactionFormValues
    {
        public TransactionType Type { get; set; }
        public int AccountId { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public CategoryOption IncomeCategoryId { get; set; }
        public CategoryOption ExpenseCategoryId { get; set; }
        public decimal Amount { get; set; }
        public decimal FromAmount { get; set; }
        public decimal ToAmount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public bool Considered { get; set; }
    }

    public class CategoryOption
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int IconId { get; set; }
        public TransactionType Type { get; set; }
        public string MainCategoryName { get; set; }
        public int MainCategoryId { get; set; }
    }
}

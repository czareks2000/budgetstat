using Domain.Enums;

namespace Application.Dto.Transaction
{
    public class TransactionListItem
    {
        public int Id { get; set; }
        public int TransactionId { get; set; }
        public string AccountName { get; set; }
        public int? AccountId { get; set; }
        public CategoryItem Category { get; set; }
        public AmountItem Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
    }

    public class CategoryItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int IconId { get; set; }
    }

    public class AmountItem
    {
        public decimal Value { get; set; }
        public TransactionType Type { get; set; }
        public string CurrencySymbol { get; set; }
    }
}

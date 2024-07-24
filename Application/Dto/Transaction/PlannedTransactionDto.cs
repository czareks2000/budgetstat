using Application.Dto.Category;

namespace Application.Dto.Transaction
{
    public class PlannedTransactionDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public CategoryDto Category { get; set; }
        public int? AccountId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public bool Considered { get; set; }
        public bool Planned { get; set; }
        public int CurrencyId { get; set; }
    }
}

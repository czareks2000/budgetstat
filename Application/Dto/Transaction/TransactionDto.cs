namespace Application.Dto.Transaction
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int CategoryId { get; set; }
        public int? AccountId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public bool Considered { get; set; } 
        public bool Planned { get; set; }
        public int CurrencyId { get; set; }
    }
}

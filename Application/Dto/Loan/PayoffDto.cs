namespace Application.Dto.Loan
{
    public class PayoffDto
    {
        public int Id { get; set; }
        public int LoanId { get; set; }
        public decimal Amount { get; set; }
        public int AccountId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public int CurrencyId { get; set; }
    }
}

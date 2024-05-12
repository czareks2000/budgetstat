namespace Domain
{
    public class Payoff
    {
        public int Id { get; set; }
        public int LoanId { get; set; }
        public decimal Amount { get; set; }
        public int AccountId { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow.Date;
        public string Description { get; set; }
        public int CurrencyId { get; set; }

        public virtual Currency Currency { get; set; }
        public virtual Loan Loan { get; set; }
        public virtual Account Account { get; set; }
    }
}
namespace Domain
{
    public class Payoff
    {
        public int Id { get; set; }
        public int LoanId { get; set; }
        public decimal Amount { get; set; }
        public int AccountId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }

        public virtual Loan Loan { get; set; }
        public virtual Account Account { get; set; }
    }
}
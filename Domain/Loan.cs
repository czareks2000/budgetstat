using Domain.Enums;

namespace Domain
{
    public class Loan
    {
        public int Id { get; set; }
        public LoanType LoanType { get; set; }
        public int AccountId { get; set; }
        public decimal CurrentAmount { get; set; } = 0;
        public decimal FullAmount { get; set; }
        public int CounterpartyId { get; set; }
        public DateTime LoanDate { get; set; }
        public DateTime RepaymentDate { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public LoanStatus LoanStatus { get; set; } = LoanStatus.InProgress;

        public User User { get; set; }
        public virtual Account Account { get; set; }
        public virtual Counterparty Counterparty { get; set; }
        public virtual ICollection<Payoff> Payoffs { get; set; }
    }
}

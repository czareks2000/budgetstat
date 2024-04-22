using Domain.Enums;

namespace Domain
{
    public class Account
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Balance { get; set; }
        public int CurrencyId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Description { get; set; }
        public AccountStatus Status { get; set; } = AccountStatus.Visible;
        public string UserId { get; set; }

        public virtual Currency Currency { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ICollection<Loan> Loans { get; set; }
        public virtual ICollection<Payoff> Payoffs { get; set; }
        public virtual ICollection<Transfer> Sources { get; set; }
        public virtual ICollection<Transfer> Destinations { get; set; }
    }
}

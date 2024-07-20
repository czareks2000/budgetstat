using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class User : IdentityUser
    {
        public int CurrencyId { get; set; }

        public virtual Currency DefaultCurrency { get; set; }
        public virtual ICollection<Budget> Budgets{ get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ICollection<Account> Accounts { get; set; }
        public virtual ICollection<Category> Categories { get; set; }
        public virtual ICollection<Loan> Loans { get; set; }
        public virtual ICollection<Counterparty> Counterparties { get; set; }
        public virtual ICollection<Asset> Assets { get; set; }
    }
}

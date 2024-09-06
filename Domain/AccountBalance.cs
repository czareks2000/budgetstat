using Microsoft.EntityFrameworkCore;

namespace Domain
{
    public class AccountBalance
    {
        public int Id { get; set; }
        [Precision(18, 2)]
        public decimal Balance { get; set; }
        public int CurrencyId { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow.Date;
        public int AccountId { get; set; }

        public virtual Currency Currency { get; set; }
        public virtual Account Account { get; set; }
    }
}

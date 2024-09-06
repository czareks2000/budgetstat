using Microsoft.EntityFrameworkCore;

namespace Domain
{
    public class Transaction
    {
        public int Id { get; set; }
        [Precision(18, 2)]
        public decimal Amount { get; set; }
        public int CategoryId { get; set; }
        public int? AccountId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public bool Considered { get; set; } = true;
        public bool Planned { get; set; } = false;
        public int CurrencyId { get; set; }
        public string UserId { get; set; }

        public virtual User User { get; set; }
        public virtual Account Account { get; set; }
        public virtual Category Category { get; set; }
        public virtual Currency Currency { get; set; }
    }
}

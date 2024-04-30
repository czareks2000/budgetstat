namespace Domain
{
    public class AccountBalance
    {
        public int Id { get; set; }
        public decimal Balance { get; set; }
        public int CurrencyId { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int AccountId { get; set; }

        public virtual Currency Currency { get; set; }
        public virtual Account Account { get; set; }
    }
}

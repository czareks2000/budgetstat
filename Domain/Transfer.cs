namespace Domain
{
    public class Transfer
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public DateTime Date { get; set; }
        public int CurrencyId { get; set; }

        public virtual Account FromAccount { get; set; }
        public virtual Account ToAccount { get; set; }
        public virtual Currency Currency { get; set; }
    }
}

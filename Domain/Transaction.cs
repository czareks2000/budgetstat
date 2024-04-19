namespace Domain
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int CategoryId { get; set; }
        public int AccountId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public bool Considered { get; set; } = true;
        public bool Planned { get; set; } = false;

        public virtual Account Account { get; set; }
        public virtual Category Category { get; set; }
    }
}

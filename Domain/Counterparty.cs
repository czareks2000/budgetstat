namespace Domain
{
    public class Counterparty
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Loan> Loans { get; set; }
    }
}
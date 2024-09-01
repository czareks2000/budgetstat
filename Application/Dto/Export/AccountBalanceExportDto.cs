namespace Application.Dto.Export
{
    public class AccountBalanceExportDto
    {
        public decimal Balance { get; set; }
        public string Currency { get; set; }
        public DateTime Date { get; set; }
        public int AccountId { get; set; }
    }
}

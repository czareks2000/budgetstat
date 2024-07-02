namespace Application.Dto.Transfer
{
    public class TransferCreateUpdateDto
    {
        public decimal FromAmount { get; set; }
        public decimal ToAmount { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public DateTime Date { get; set; }
    }
}

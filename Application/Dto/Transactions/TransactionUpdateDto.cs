using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Transactions
{
    public class TransactionUpdateDto
    {
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public int AccountId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int CurrencyId { get; set; }
    }
}

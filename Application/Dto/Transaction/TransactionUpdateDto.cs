using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Transaction
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
        public string Description { get; set; }
    }
}

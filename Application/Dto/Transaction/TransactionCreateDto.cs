using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Transaction
{
    public class TransactionCreateDto
    {
        [Required]
        [GreaterThanZero(ErrorMessage = "The amount must be positive")]
        public decimal Amount { get; set; }
        [GreaterThanZero(ErrorMessage = "Invalid category id")]
        public int CategoryId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public string Description { get; set; }
        [Required]
        public bool Considered { get; set; }
    }
}

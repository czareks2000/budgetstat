using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Transaction
{
    public class TransactionUpdateDto
    {
        [Required]
        [GreaterThanZero(ErrorMessage = "The amount must be positive")]
        public decimal Amount { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid category id")]
        public int CategoryId { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid account id")]
        public int AccountId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public string Description { get; set; }
    }
}

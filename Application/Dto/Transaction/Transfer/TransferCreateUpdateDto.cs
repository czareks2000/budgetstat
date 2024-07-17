using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Transaction.Transfer
{
    public class TransferCreateUpdateDto
    {
        [Required]
        [GreaterThanZero(ErrorMessage = "The FromAmount must be positive")]
        public decimal FromAmount { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "The ToAmount must be positive")]
        public decimal ToAmount { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid FromAccount id")]
        public int FromAccountId { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid ToAccount id")]
        public int ToAccountId { get; set; }
        [Required]
        public DateTime Date { get; set; }
    }
}

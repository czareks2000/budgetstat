using Application.Core.CustomDataAnnotations;
using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Loan
{
    public class ColectivePayoffDto
    {
        [Required]
        [GreaterThanZero(ErrorMessage = "The amount must be positive")]
        public decimal Amount { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid account id")]
        public int AccountId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public LoanType LoanType { get; set; }
    }
}

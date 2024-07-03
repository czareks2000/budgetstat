using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Loan
{
    public class LoanUpdateDto
    {
        [Required]
        [GreaterThanZero(ErrorMessage = "The amount must be positive")]
        public decimal FullAmount { get; set; }
        [Required]
        public DateTime RepaymentDate { get; set; }
    }
}

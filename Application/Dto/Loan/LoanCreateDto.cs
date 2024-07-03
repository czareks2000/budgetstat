using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using Application.Core.CustomDataAnnotations;

namespace Application.Dto.Loan
{
    public class LoanCreateDto
    {
        [Required]
        [EnumDataType(typeof(LoanType), ErrorMessage = "Loan type is empty or invalid")]
        public LoanType LoanType { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid account id")]
        public int AccountId { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "The amount must be positive")]
        public decimal FullAmount { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid counterparty id")]
        public int CounterpartyId { get; set; }
        [Required]
        public DateTime RepaymentDate { get; set; }
        public string Description { get; set; }
    }
}

using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Account
{
    public class AccountCreateDto
    {
        [Required]
        public string Name { get; set; }
        [GreaterOrEqualToZero(ErrorMessage = "Account balance cannot be negative")]
        public decimal Balance { get; set; }
        [GreaterThanZero(ErrorMessage = "Invalid currency id")]
        public int CurrencyId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public string Description { get; set; }
    }
}

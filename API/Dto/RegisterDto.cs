using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace API.Dto
{
    public class RegisterDto
    {   
        [Required]
        public string UserName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [GreaterThanZero(ErrorMessage = "Invalid currency id")]
        public int DefaultCurrencyId { get; set; }
        [Required]
        [RegularExpression(@"(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{4,}$",
            ErrorMessage =
                "Password needs to have " +
                "at least one digit, " +
                "one lowercase letter, " +
                "one uppercase letter, " +
                "one special character, " +
                "and minimum 4 characters.")]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
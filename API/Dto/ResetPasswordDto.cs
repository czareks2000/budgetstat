using System.ComponentModel.DataAnnotations;

namespace API.Dto
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression(@"(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{4,}$",
        ErrorMessage =
            "Password needs to have " +
            "at least one digit, " +
            "one lowercase letter, " +
            "one uppercase letter, " +
            "one special character, " +
            "and minimum 4 characters.")]
        public string NewPassword { get; set; }
        [Required]
        [Compare("NewPassword")]
        public string ConfirmNewPassword { get; set; }
    }
}

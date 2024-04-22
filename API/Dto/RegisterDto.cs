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
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$", 
            ErrorMessage = 
                "Password needs to have "+
                "at least one digit, "+
                "one lowercase letter, "+
                "one uppercase letter, "+
                "and a minimum 4 characters.")]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
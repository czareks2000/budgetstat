using System.ComponentModel.DataAnnotations;

namespace API.Dto
{
    public class ChangePasswordDto
    {   
        [Required]
        public string CurrentPassword { get; set; }
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$", 
            ErrorMessage = 
                "Password needs to have "+
                "at least one digit, "+
                "one lowercase letter, "+
                "one uppercase letter, "+
                "and a minimum characters.")]
        public string NewPassword { get; set; }
        [Required]
        [Compare("NewPassword")]
        public string ConfirmNewPassword { get; set; }
    }
}
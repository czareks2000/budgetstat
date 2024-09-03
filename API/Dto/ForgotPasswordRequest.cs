using System.ComponentModel.DataAnnotations;

namespace API.Dto
{
    public class ForgotPasswordRequest
    {
        [Required]
        public string Email { get; set; }
    }
}

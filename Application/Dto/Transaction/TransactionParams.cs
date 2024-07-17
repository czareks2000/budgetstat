using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Transaction
{
    public class TransactionParams
    {
        // end date nie moze być przed start date
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        public List<TransactionType> Types { get; set; } = [];
        public List<int> AccountIds { get; set; } = [];
        public List<int> CategoryIds { get; set; } = [];
    }
}

using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Transaction
{
    public class PlannedTransactionsDto
    {
        [Required]
        [GreaterThanZero(ErrorMessage = "The amount must be positive")]
        public decimal Amount { get; set; }
        [GreaterThanZero(ErrorMessage = "Invalid category id")]
        public int CategoryId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        public string Description { get; set; }
        [Required]
        public bool Considered { get; set; }
        [Required]
        [GreaterOrEqualToZero(ErrorMessage = "RepeatsEvery cannot be negative")]
        public decimal RepeatsEvery { get; set; }
        [Required]
        [EnumDataType(typeof(Period), ErrorMessage = "Period is empty or invalid")]
        public Period Period { get; set; }
        [Required]
        [GreaterOrEqualToZero(ErrorMessage = "NumberOfTimes cannot be negative")]
        public decimal NumberOfTimes { get; set; }
    }
}

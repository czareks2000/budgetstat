using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Counterparty
{
    public class CounterpartyCreateDto
    {
        [Required]
        public string Name { get; set; }
    }
}

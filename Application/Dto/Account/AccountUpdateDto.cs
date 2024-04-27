using Application.Core.CustomDataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Account
{
    public class AccountUpdateDto
    {
        public string Name { get; set; }
        public int CurrencyId { get; set; }
        public string Description { get; set; }
    }
}

using Domain.Enums;

namespace Application.Dto
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Balance { get; set; }
        public decimal ConvertedBalance { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Description { get; set; }
        public AccountStatus Status { get; set; }

        public CurrencyDto Currency { get; set; }
    }
}

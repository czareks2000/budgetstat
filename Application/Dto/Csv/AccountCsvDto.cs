using Domain.Enums;

namespace Application.Dto.Csv
{
    public class AccountCsvDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CurrencyId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Description { get; set; }
        public AccountStatus Status { get; set; }
    }
}

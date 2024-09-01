using Domain.Enums;
using System.Text.Json.Serialization;

namespace Application.Dto.Export
{
    public class AccountExportDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        
        public decimal Balance { get; set; }
        public string Currency { get; set; }
        public DateTime BalanceDate { get; set; }

        public string Description { get; set; }
        public AccountStatus Status { get; set; }
    }
}

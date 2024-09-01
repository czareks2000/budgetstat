using Domain.Enums;
using System.Text.Json.Serialization;

namespace Application.Dto.Export
{
    public class LoanExportDto
    {
        public int Id { get; set; }
        public LoanType LoanType { get; set; }

        public decimal CurrentAmount { get; set; }
        public decimal FullAmount { get; set; }
        public string Currency { get; set; }

        public string Counterparty { get; set; }
        public DateTime LoanDate { get; set; }
        public DateTime RepaymentDate { get; set; }
        public string Description { get; set; }
    }
}

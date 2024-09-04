using Domain.Enums;

namespace Application.Dto.Import
{
    public class TransactionImportDto
    {
        public DateTime Date { get; set; }

        public TransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }

        public string Description { get; set; }

        public string Account { get; set; }

        public string MainCategory { get; set; }
        public string Category { get; set; }

        public bool Considered { get; set; }
    }
}

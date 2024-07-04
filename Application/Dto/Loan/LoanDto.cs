using Domain.Enums;
using Domain;

namespace Application.Dto.Loan
{
    public class LoanDto
    {
        public int Id { get; set; }
        public LoanType LoanType { get; set; }
        public int AccountId { get; set; }
        public decimal CurrentAmount { get; set; }
        public decimal FullAmount { get; set; }
        public int CounterpartyId { get; set; }
        public DateTime LoanDate { get; set; }
        public DateTime RepaymentDate { get; set; }
        public string Description { get; set; }
        public LoanStatus LoanStatus { get; set; }
        public int CurrencyId { get; set; }

        public virtual List<PayoffDto> Payoffs { get; set; }
    }
}

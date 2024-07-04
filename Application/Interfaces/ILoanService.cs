using Application.Core;
using Application.Dto.Counterparty;
using Application.Dto.Loan;
using Domain.Enums;

namespace Application.Interfaces
{
    public interface ILoanService
    {
        // dodanie podmiotu
        Task<Result<CounterpartyDto>> CreateCounterparty(CounterpartyCreateDto newCounterparty);
        // usunięcie podmiotu
        Task<Result<object>> DeleteCounterparty(int counterpartyId);
        // przeglądanie podmiotów
        Task<Result<List<CounterpartyDto>>> GetAllCounterparties();

        // utworzenie zobowiązania
        Task<Result<LoanDto>> CreateLoan(LoanCreateDto newLoan);
        // przegląd zobowiązań (podział na InProgress i PaidOff)
        Task<Result<List<LoanDto>>> GetLoans(LoanStatus loanStatus);
        // edycja zobowiązania
        Task<Result<LoanDto>> UpdateLoan(int loanId, LoanUpdateDto updatedLoan);
        // usunięcie zobowiązania
        Task<Result<object>> DeleteLoan(int loanId);

        // spłata zobowiązania
        Task<Result<LoanDto>> CreatePayoff(int loanId, PayoffCreateDto newPayoff);
        // usunięcie spłaconej raty
        Task<Result<LoanDto>> DeletePayoff(int payoffId);
    }
}

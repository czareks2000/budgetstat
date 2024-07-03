using Application.Core;
using Application.Dto.Counterparty;
using Application.Dto.Loan;

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
        // przegląd zobowiązań
        Task<Result<List<LoanDto>>> GetAll();
        // edycja zobowiązania
        Task<Result<LoanDto>> UpdateLoan(int loanId, LoanUpdateDto updatedLoan);
        // usunięcie zobowiązania
        Task<Result<object>> DeleteLoan(int loanId);

        // spłata zobowiązania
        // usunięcie spłaconej raty
        // przegląd historii spłaconych rat
    }
}

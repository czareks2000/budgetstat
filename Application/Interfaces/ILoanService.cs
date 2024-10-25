﻿using Application.Core;
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
        Task<Result<List<LoanDto>>> GetLoans(LoanStatus loanStatus, int counterpartyId = 0);
        // pobranie pojedynczego loan
        Task<Result<LoanDto>> GetLoan(int loanId);
        // edycja zobowiązania
        Task<Result<LoanDto>> UpdateLoan(int loanId, LoanUpdateDto updatedLoan);
        // usunięcie zobowiązania
        Task<Result<object>> DeleteLoan(int loanId);

        // spłata zobowiązania
        Task<Result<LoanDto>> CreatePayoff(int loanId, PayoffCreateDto newPayoff);
        // zbiorowa spłata
        Task<Result<List<LoanDto>>> CollectivePayoff(int counterpartyId, ColectivePayoffDto collectivePayoff);
        // usunięcie spłaconej raty
        Task<Result<LoanDto>> DeletePayoff(int payoffId);
    }
}

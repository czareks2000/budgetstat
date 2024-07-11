using Application.Core;
using Application.Dto.Counterparty;
using Application.Dto.Loan;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;

namespace Application.Services
{
    public class LoanService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : ILoanService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<CounterpartyDto>> CreateCounterparty(CounterpartyCreateDto newCounterparty)
        {
            var user = await _utilities.GetCurrentUserAsync();

            var counterparty = _mapper.Map<Counterparty>(newCounterparty);
            counterparty.User = user;

            _context.Counterparties.Add(counterparty);

            if (await _context.SaveChangesAsync() == 0)
                return Result<CounterpartyDto>.Failure("Failed to create counterparty");

            var counterpartyDto = _mapper.Map<CounterpartyDto>(counterparty);

            return Result<CounterpartyDto>.Success(counterpartyDto);
        }

        public async Task<Result<object>> DeleteCounterparty(int counterpartyId)
        {
            var counterparty = await _context.Counterparties
                .Include(c => c.Loans)
                .FirstOrDefaultAsync(c => c.Id == counterpartyId);

            if (counterparty == null) return null;

            if (counterparty.Loans.Any(l => l.LoanStatus == LoanStatus.InProgress))
                return Result<object>.Failure("Unable to delete a counterparty that has loans in progress");

            _context.Counterparties.Remove(counterparty);

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete counterparty");

            return Result<object>.Success(null);
        }

        public async Task<Result<List<CounterpartyDto>>> GetAllCounterparties()
        {
            var user = await _utilities.GetCurrentUserAsync();

            var counterpartyDtos = await _context.Counterparties
                .Where(c => c.UserId == user.Id)
                .ProjectTo<CounterpartyDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<CounterpartyDto>>.Success(counterpartyDtos);
        }

        public async Task<Result<LoanDto>> CreateLoan(LoanCreateDto newLoan)
        {
            var user = await _utilities.GetCurrentUserAsync();

            // sprawdzenie podmiotu
            var counterparty = await _context.Counterparties
                .FirstOrDefaultAsync(c => c.Id == newLoan.CounterpartyId && c.UserId == user.Id);

            if (counterparty == null)
                return Result<LoanDto>
                    .Failure("Invalid counterparty. It does not exist or does not belong to the user");

            // sprawdzenie konta
            var account = await _context.Accounts
                .Include(a => a.Currency)
                .FirstOrDefaultAsync(a => a.Id == newLoan.AccountId && a.UserId == user.Id);

            if (account == null)
                return Result<LoanDto>
                    .Failure("Invalid account. It does not exist or does not belong to the user");

            // utworzenie zobowiązania
            var loan = _mapper.Map<Loan>(newLoan);
            loan.User = user;
            loan.Counterparty = counterparty;
            loan.Account = account;
            loan.Currency = account.Currency;

            _context.Loans.Add(loan);

            // zaktualizowanie sald konta
            var isExpense = loan.LoanType == LoanType.Credit;
            if(!_utilities.UpdateAccountBalances(account.Id, loan.LoanDate, isExpense, loan.FullAmount))
                return Result<LoanDto>.Failure($"Insufficient funds in the account.");

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<LoanDto>.Failure("Failed to create loan");

            // utworzenie obiektu DTO
            var loanDto = _mapper.Map<LoanDto>(loan);

            return Result<LoanDto>.Success(loanDto);
        }

        public async Task<Result<List<LoanDto>>> GetLoans(LoanStatus loanStatus, int counterpartyId = 0)
        {
            var user = await _utilities.GetCurrentUserAsync();

            var loanDtos = await _context.Loans
                .Include(l => l.Payoffs)
                .Where(l => l.UserId == user.Id)
                .Where(l => l.LoanStatus == loanStatus)
                .ProjectTo<LoanDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            if (counterpartyId > 0)
                loanDtos = loanDtos.Where(l => l.CounterpartyId == counterpartyId).ToList();

            return Result<List<LoanDto>>.Success(loanDtos);
        }

        public async Task<Result<LoanDto>> GetLoan(int loanId)
        {
            var loan = await _context.Loans
                .Include(l => l.Payoffs)
                .FirstOrDefaultAsync(l => l.Id == loanId);

            if (loan == null) return null;

            // utworzenie obiektu DTO
            var loanDto = _mapper.Map<LoanDto>(loan);

            return Result<LoanDto>.Success(loanDto);
        }

        public async Task<Result<LoanDto>> UpdateLoan(int loanId, LoanUpdateDto updatedLoan)
        {
            var loan = await _context.Loans
                .Include(l => l.Payoffs)
                .Include(l => l.Account)
                .FirstOrDefaultAsync(l => l.Id == loanId);

            if (loan == null) return null;

            // sprawdzenie czy ma przypisane konto
            if (loan.Account == null)
                return Result<LoanDto>.Failure("You can't edit a loan with no account assigned to it");

            // sprawdzenie czy spłacone
            if (loan.LoanStatus == LoanStatus.PaidOff)
                return Result<LoanDto>.Failure("Cant edit loan with PaidOff status.");

            // sprawdzenie czy nowa kwota jest nie mniejsza niż currentAmount
            var oldFullAmount = loan.FullAmount;
            var newFullAmount = updatedLoan.FullAmount;
            var currentAmount = loan.CurrentAmount;

            if (newFullAmount < currentAmount)
                return Result<LoanDto>
                    .Failure($"The new amount of the loan cannot be less than the amount already repaid ({currentAmount}).");

            // aktualizacja sald
            var isExpense = loan.LoanType == LoanType.Credit;
            var difference = newFullAmount - oldFullAmount;
            if (!_utilities.UpdateAccountBalances((int)loan.AccountId, loan.LoanDate, isExpense, difference))
                return Result<LoanDto>.Failure($"Insufficient funds in the account.");

            // aktualizacja zobowiązania
            _mapper.Map(updatedLoan, loan);

            if (currentAmount == newFullAmount)
                    loan.LoanStatus = LoanStatus.PaidOff;

            _context.Loans.Update(loan);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<LoanDto>.Failure("Failed to update loan");

            // utworzenie obiektu DTO
            var loanDto = _mapper.Map<LoanDto>(loan);

            return Result<LoanDto>.Success(loanDto);
        }

        public async Task<Result<object>> DeleteLoan(int loanId)
        {
            var loan = await _context.Loans
                .Include(l => l.Payoffs)
                .Include(l => l.Account)
                .FirstOrDefaultAsync(l => l.Id == loanId);

            if (loan == null) return null;

            if (loan.LoanStatus == LoanStatus.InProgress)
            {
                // cofnięcie sald kont na podstawie payoffs
                var wasExpense = loan.LoanType == LoanType.Debt;
                foreach (var pay in loan.Payoffs)
                {
                    _utilities.RestoreAccountBalances(
                        (int)pay.AccountId, wasExpense, pay.Amount, pay.Date
                    );
                }

                // cofnięcie salda orginalnego konta na podstawie fullAmount
                wasExpense = loan.LoanType == LoanType.Credit;

                _utilities.RestoreAccountBalances(
                    (int)loan.AccountId, wasExpense, loan.FullAmount, loan.LoanDate
                );
            }            

            // usunięcie Loan
            _context.Loans.Remove(loan);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete loan");

            return Result<object>.Success(null);
        }

        public async Task<Result<LoanDto>> CreatePayoff(int loanId, PayoffCreateDto newPayoff)
        {
            // sprawdzenie czy data nie jest w przyszłości
            var currentDate = DateTime.UtcNow.Date;

            if(newPayoff.Date.Date > currentDate)
                return Result<LoanDto>
                    .Failure("Date cannot be in the future");

            // sprawdzenie czy istnieje
            var loan = await _context.Loans
                .Include(l => l.Payoffs)
                .FirstOrDefaultAsync(l => l.Id == loanId); 

            if (loan == null) return null;

            // sprawdzenie konta
            var user = await _utilities.GetCurrentUserAsync();

            var account = await _context.Accounts
                .Include(a => a.Currency)
                .FirstOrDefaultAsync(a => a.Id == newPayoff.AccountId && a.UserId == user.Id);

            if (account == null)
                return Result<LoanDto>
                    .Failure("Invalid account. It does not exist or does not belong to the user");

            // sprawdzenie czy konto ma tą samą walutę co loan
            if (account.CurrencyId != loan.CurrencyId)
                return Result<LoanDto>
                    .Failure($"The account must have the same currency in which the loan was made " +
                        $"({account.Currency.Code}).");

            // utworzenie payoff'a
            var payoff = _mapper.Map<Payoff>(newPayoff);
            payoff.Loan = loan;
            payoff.Account = account;
            payoff.Currency = account.Currency;

            loan.Payoffs.Add(payoff);

            _context.Payoffs.Add(payoff);

            // sprawdzenie czy podano odpowiednią kwotę
            var missingAmount = loan.FullAmount - loan.CurrentAmount;
            var newCurrentAmount = loan.CurrentAmount + payoff.Amount;

            if (newCurrentAmount > loan.FullAmount)
                return Result<LoanDto>
                    .Failure($"Amount cannot be greater than {missingAmount}");

            // aktualizacja loan
            if (newCurrentAmount == loan.FullAmount)
                loan.LoanStatus = LoanStatus.PaidOff;

            loan.CurrentAmount = newCurrentAmount;

            _context.Loans.Update(loan);

            // aktualizacja salda konta
            var isExpense = loan.LoanType == LoanType.Debt;
            if(!_utilities.UpdateAccountBalances(account.Id, payoff.Date, isExpense, payoff.Amount))
                return Result<LoanDto>
                    .Failure($"Insufficient funds in the account.");

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<LoanDto>.Failure("Failed to create payoff");

            // utworzenie obiektu DTO
            var loanDto = _mapper.Map<LoanDto>(loan);

            return Result<LoanDto>.Success(loanDto);
        }

        public async Task<Result<List<LoanDto>>> CollectivePayoff(int counterpartyId, ColectivePayoffDto collectivePayoff)
        {
            // sprawdzenie czy data nie jest w przyszłości
            var currentDate = DateTime.UtcNow.Date;

            if (collectivePayoff.Date.Date > currentDate)
                return Result<List<LoanDto>>
                    .Failure("Date cannot be in the future");

            // sprawdzenie czy istnieje
            var counterparty = await _context.Counterparties
                .Include(c => c.Loans)
                    .ThenInclude(l => l.Payoffs)
                .FirstOrDefaultAsync(c => c.Id == counterpartyId);

            if (counterparty == null) return null;

            // sprawdzenie konta
            var user = await _utilities.GetCurrentUserAsync();

            var account = await _context.Accounts
                .Include(a => a.Currency)
                .FirstOrDefaultAsync(a => a.Id == collectivePayoff.AccountId && a.UserId == user.Id);

            if (account == null)
                return Result<List<LoanDto>>
                    .Failure("Invalid account. It does not exist or does not belong to the user");

            // sprawdzenie czy istnieją loans
            var loans = counterparty.Loans
                .Where(l => l.LoanStatus == LoanStatus.InProgress)
                .Where(l => l.LoanType == collectivePayoff.LoanType)
                .Where(l => l.CurrencyId == account.CurrencyId)
                .OrderBy(l => l.RepaymentDate)
                .ToList();

            if (!loans.Any())
                return Result<List<LoanDto>>.Failure("There are no loans to repay");

            // sprawdzenie amount
            decimal fullAmount = 0;
            decimal currentAmount = 0;
            decimal missingAmount = 0;

            foreach (var loan in loans)
            {
                fullAmount += loan.FullAmount;
                currentAmount += loan.CurrentAmount;
            }
            missingAmount = fullAmount - currentAmount;

            if (collectivePayoff.Amount > missingAmount)
                return Result<List<LoanDto>>.Failure($"The amount cannot be greater than remaining amount ({missingAmount})");

            // utworzenie payoffs
            List<Loan> updatedLoans = new List<Loan>();
            decimal availableAmount = collectivePayoff.Amount;
            int loanIndex = 0;

            while (availableAmount > 0)
            {
                var loan = loans[loanIndex];

                // obliczenie ile przeznaczyć dostępnego amount
                decimal currentLoanAmount = loan.CurrentAmount;
                decimal fullLoanAmount = loan.FullAmount;
                decimal missingLoanAmount = fullLoanAmount - currentLoanAmount;

                decimal amount = 0;

                if (missingLoanAmount > availableAmount)
                    amount = availableAmount;
                else
                    amount = missingLoanAmount;

                // utworzenie payoff'a
                var payoff = new Payoff
                {
                    Amount = amount,
                    Date = collectivePayoff.Date,
                    Description = "collective repayment",
                    Loan = loan,
                    Account = account,
                    Currency = account.Currency,
                };

                loan.Payoffs.Add(payoff);

                _context.Payoffs.Add(payoff);

                // aktualizacja loan
                var newCurrentAmount = currentLoanAmount + payoff.Amount;

                if (newCurrentAmount == loan.FullAmount)
                    loan.LoanStatus = LoanStatus.PaidOff;

                loan.CurrentAmount = newCurrentAmount;

                _context.Loans.Update(loan);
                updatedLoans.Add(loan);

                // aktualizacja salda konta
                var isExpense = loan.LoanType == LoanType.Debt;
                if (!_utilities.UpdateAccountBalances(account.Id, payoff.Date, isExpense, payoff.Amount))
                    return Result<List<LoanDto>>
                        .Failure($"Insufficient funds in the account.");

                // aktualizcja zmiennych pomocniczych
                availableAmount -= amount;
                loanIndex++;
            }

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<List<LoanDto>>.Failure("Failed to create payoffs");

            // utworzenie obiektu dto
            var loanDtos = _mapper.Map<List<LoanDto>>(updatedLoans);

            return Result<List<LoanDto>>.Success(loanDtos);
        }

        public async Task<Result<LoanDto>> DeletePayoff(int payoffId)
        {
            var payoff = await _context.Payoffs
                .Include(p => p.Loan)
                .FirstOrDefaultAsync(p => p.Id == payoffId);

            if (payoff == null) return null;

            // aktualiazaja salda
            var wasExpense = payoff.Loan.LoanType == LoanType.Debt;
            _utilities.RestoreAccountBalances(
                payoff.AccountId, wasExpense, payoff.Amount, payoff.Date
            );

            // aktualizacja loan
            var loan = payoff.Loan;
            loan.CurrentAmount -= payoff.Amount;
            loan.LoanStatus = LoanStatus.InProgress;

            _context.Loans.Update(loan);

            // usunięcie payoff
            _context.Payoffs.Remove(payoff);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<LoanDto>.Failure("Failed to create payoff");

            // utworzenie obiektu DTO
            var loanDto = await _context.Loans
                .Include(l => l.Payoffs)
                .ProjectTo<LoanDto>(_mapper.ConfigurationProvider)
                .FirstAsync(l => l.Id == loan.Id);

            return Result<LoanDto>.Success(loanDto);
        }
    }
}

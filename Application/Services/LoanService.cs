using Application.Core;
using Application.Dto.Budget;
using Application.Dto.Counterparty;
using Application.Dto.Loan;
using Application.Dto.Transaction;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;

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
                .FirstOrDefaultAsync(c => c.Id == counterpartyId);

            if (counterparty == null) return null;

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
                return Result<LoanDto>.Failure($"Insufficient funds in the account. Change the date or amount.");

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<LoanDto>.Failure("Failed to create loan");

            // utworzenie obiektu DTO
            var loanDto = _mapper.Map<LoanDto>(loan);

            return Result<LoanDto>.Success(loanDto);
        }

        public async Task<Result<List<LoanDto>>> GetAll()
        {
            var user = await _utilities.GetCurrentUserAsync();

            var loanDtos = await _context.Loans
                .Where(l => l.UserId == user.Id)
                .ProjectTo<LoanDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<LoanDto>>.Success(loanDtos);
        }

        public async Task<Result<LoanDto>> UpdateLoan(int loanId, LoanUpdateDto updatedLoan)
        {
            var loan = await _context.Loans
                .FirstOrDefaultAsync(l => l.Id == loanId);

            if (loan == null) return null;

            // sprawdzenie czy nowa kwota jest nie mniejsza niż currentAmount
            var oldFullAmount = loan.FullAmount;
            var newFullAmount = updatedLoan.FullAmount;
            var currentAmount = loan.CurrentAmount;

            if (newFullAmount < currentAmount)
                return Result<LoanDto>
                    .Failure("The new amount of the loan cannot be less than the amount already repaid.");

            // aktualizacja sald
            var isExpense = loan.LoanType == LoanType.Credit;
            var difference = newFullAmount - oldFullAmount;
            if (!_utilities.UpdateAccountBalances(loan.AccountId, loan.LoanDate, isExpense, difference))
                return Result<LoanDto>.Failure($"Insufficient funds in the account. Change the date or amount.");

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
                .FirstOrDefaultAsync(l => l.Id == loanId);

            if (loan == null) return null;

            // cofnąć saldo kont na podstawie payoffs
            // cofnąć saldo orginalnego konta na podstawie fullAmount
            throw new NotImplementedException();
        }
    }
}

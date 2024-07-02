using Application.Core;
using Application.Dto.Transaction;
using Application.Dto.Transfer;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class TransactionService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : ITransactionService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<TransactionDto>> Create(int accountId, TransactionCreateDto newTransaction)
        {
            // sprawdzenie czy konto istnieje
            var account = await _context.Accounts
                .Include(a => a.Currency)
                .Include(a => a.AccountBalances)
                .FirstOrDefaultAsync(a => a.Id == accountId);

            if (account == null) return null;

            // sprawdzenie czy kategoria istnieje i czy nie jest głowną kategorią
            var category = _context.Categories
                .FirstOrDefault(category => category.Id == newTransaction.CategoryId);

            if (category == null || category.IsMain) 
                return Result<TransactionDto>.Failure("Invalid category. It does not exist or is the main category");

            // aktualizacja salda
            if (account.AccountBalances.Count == 0)
                return Result<TransactionDto>.Failure("The account has no balance");

            var isExpense = category.Type == TransactionType.Expense;

            var newTransactionDate = newTransaction.Date.Date;

            if (!UpdateAccountBalances(account, newTransactionDate, isExpense, newTransaction.Amount))
                return Result<TransactionDto>.Failure($"Insufficient funds in the account. Change the date or amount.");

            // utworzenie transakcji
            var transaction = _mapper.Map<Transaction>(newTransaction);

            transaction.Account = account;
            transaction.Currency = account.Currency;
            transaction.Category = category;

            _context.Transactions.Add(transaction);

            if (await _context.SaveChangesAsync() == 0)
                return Result<TransactionDto>.Failure("Failed to create transaction");

            // utworzenie obiektu DTO
            var transactionDto = _mapper.Map<TransactionDto>(transaction);

            return Result<TransactionDto>.Success(transactionDto);
        }

        public async Task<Result<object>> Delete(int transactionId)
        {
            // sprawdzenie czy transakcja istnieje
            var transaction = await _context.Transactions
                .Include(t => t.Account)
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == transactionId);

            if (transaction == null) return null;

            // usunięcie transakcji
            _context.Transactions.Remove(transaction);

            // aktualizacja sald konta
            if (transaction.Account != null)
            {
                int accountId = (int)transaction.AccountId;
                var wasExpense = transaction.Category.Type == TransactionType.Expense;

                RestoreAccountBalances(accountId, wasExpense, transaction.Amount, transaction.Date);
            }

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete transaction");

            return Result<object>.Success(null);
        }

        public async Task<Result<TransactionDto>> Update(int transactionId, TransactionUpdateDto updatedTransaction)
        {
            // sprawdzenie czy transakcja istnieje
            var transaction = await _context.Transactions
                .Include(t => t.Account)
                    .ThenInclude(a => a.AccountBalances)
                .FirstOrDefaultAsync(t => t.Id == transactionId);

            if (transaction == null) return null;

            // walidacja kategorii
            var newCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == updatedTransaction.CategoryId);

            if (newCategory == null || newCategory.IsMain)
                return Result<TransactionDto>.Failure("Invalid category. It does not exist or is the main category");   

            // walidacja usera
            var user = await _utilities.GetCurrentUserAsync();

            if (user == null)
                return Result<TransactionDto>.Failure("User not found");

            // walidacja konta
            var newAccount = await _context.Accounts
                .Include(a => a.AccountBalances)
                .FirstOrDefaultAsync(a => a.Id == updatedTransaction.AccountId && a.UserId == user.Id);

            if (newAccount == null)
                return Result<TransactionDto>.Failure("Invalid account. It does not exist or does not belong to the user.");

            // aktualizacja salda nowego konta
            var isExpense = newCategory.Type == TransactionType.Expense;

            if (!UpdateAccountBalances(newAccount, transaction.Date, isExpense, updatedTransaction.Amount))
                return Result<TransactionDto>.Failure("Insufficient funds in the account. Change the date or amount.");

            // aktualizacja salda starego konta
            if (transaction.Account != null)
            {
                int accountId = (int)transaction.AccountId;
                var wasExpense = transaction.Category.Type == TransactionType.Expense;

                RestoreAccountBalances(accountId, wasExpense, transaction.Amount, transaction.Date);
            }

            // aktualizacja transakcji
            transaction.Account = newAccount;
            transaction.Category = newCategory;

            _mapper.Map(updatedTransaction, transaction);

            if (await _context.SaveChangesAsync() == 0)
                return Result<TransactionDto>.Failure("Failed to update transaction");

            // utworzenie obiektu DTO
            var transactionDto = _mapper.Map<TransactionDto>(transaction);

            return Result<TransactionDto>.Success(transactionDto);
        }

        public Task<Result<List<TransactionDto>>> CreatePlannedTransactions(int accountId, PlannedTransactionsDto plannedTransactions)
        {
            // utworzyć transakcje bez aktualizacji sald w danej ilości
            throw new NotImplementedException();
        }

        public Task<Result<TransactionDto>> ConfirmTransaction(int transactionId)
        {
            // zmiana planned na false
            // aktualizacja sald kont
            throw new NotImplementedException();
        }

        public async Task<Result<bool>> ToggleConsideredFlag(int transactionId)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == transactionId);

            if (transaction == null) return null;

            transaction.Considered = !transaction.Considered;

            if (await _context.SaveChangesAsync() == 0)
                return Result<bool>.Failure("Failed to toggle considered status.");

            return Result<bool>.Success(transaction.Considered);
        }

        public async Task<Result<TransferDto>> Create(TransferCreateUpdateDto newTransfer)
        {
            var user = await _utilities.GetCurrentUserAsync();

            // sprawdzenie fromAccount
            var fromAccount = await _context.Accounts
                .Include(a => a.AccountBalances)
                .FirstOrDefaultAsync(a => a.Id == newTransfer.FromAccountId && a.UserId == user.Id);

            if (fromAccount == null)
                return Result<TransferDto>.Failure("Invalid FromAccount. It does not exist or does not belong to the user.");

            // sprawdzenie toAccount
            var toAccount = await _context.Accounts
                .Include(a => a.AccountBalances)
                .FirstOrDefaultAsync(a => a.Id == newTransfer.ToAccountId && a.UserId == user.Id);

            if (toAccount == null)
                return Result<TransferDto>.Failure("Invalid ToAccount. It does not exist or does not belong to the user.");

            // utworzenie transferu
            var transfer = _mapper.Map<Transfer>(newTransfer);
            transfer.FromAccount = fromAccount;
            transfer.ToAccount = toAccount;

            _context.Transfers.Add(transfer);

            // aktualizacja sald kont
            if (!UpdateAccountBalances(fromAccount, transfer.Date, true, transfer.FromAmount))
                return Result<TransferDto>.Failure("Insufficient funds in the FromAccount. Change the date or amount.");

            UpdateAccountBalances(toAccount, transfer.Date, false, transfer.ToAmount);

            if (await _context.SaveChangesAsync() == 0)
                return Result<TransferDto>.Failure("Failed create transfer");

            // utworzenie obiektu DTO
            var transferDto = _mapper.Map<TransferDto>(transfer);

            return Result<TransferDto>.Success(transferDto);
        }

        public async Task<Result<object>> DeleteTransfer(int transferId)
        {
            // sprawdzenie czy transfer istnieje
            var transfer = await _context.Transfers
                .FirstOrDefaultAsync(t => t.Id == transferId);

            if (transfer == null) return null;

            // usunięcie transferu
            _context.Transfers.Remove(transfer);

            // aktualizacja sald kont
            RestoreAccountBalances(transfer.FromAccountId, true, transfer.FromAmount, transfer.Date);
            RestoreAccountBalances(transfer.ToAccountId, false, transfer.ToAmount, transfer.Date);

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete transfer");

            return Result<object>.Success(null);
        }

        public async Task<Result<TransferDto>> Update(int transferId, TransferCreateUpdateDto updatedTransfer)
        {
            // sprawdzenie czy transfer istnieje
            var transfer = await _context.Transfers
                .FirstOrDefaultAsync(t => t.Id == transferId);

            if (transfer == null) return null;

            // przywrócenie sald kont
            RestoreAccountBalances(transfer.FromAccountId, true, transfer.FromAmount, transfer.Date);
            RestoreAccountBalances(transfer.ToAccountId, false, transfer.ToAmount, transfer.Date);

            var user = await _utilities.GetCurrentUserAsync();

            // sprawdzenie fromAccount
            var fromAccount = await _context.Accounts
                .Include(a => a.AccountBalances)
                .FirstOrDefaultAsync(a => a.Id == updatedTransfer.FromAccountId && a.UserId == user.Id);

            if (fromAccount == null)
                return Result<TransferDto>.Failure("Invalid FromAccount. It does not exist or does not belong to the user.");

            // sprawdzenie toAccount
            var toAccount = await _context.Accounts
                .Include(a => a.AccountBalances)
                .FirstOrDefaultAsync(a => a.Id == updatedTransfer.ToAccountId && a.UserId == user.Id);

            if (toAccount == null)
                return Result<TransferDto>.Failure("Invalid ToAccount. It does not exist or does not belong to the user.");

            // aktualizacja transferu
            transfer.FromAccount = fromAccount;
            transfer.ToAccount = toAccount;

            _mapper.Map(updatedTransfer, transfer);

            _context.Transfers.Update(transfer);

            // aktualizacja sald kont
            if (!UpdateAccountBalances(fromAccount, transfer.Date, true, transfer.FromAmount))
                return Result<TransferDto>.Failure("Insufficient funds in the FromAccount. Change the date or amount.");

            UpdateAccountBalances(toAccount, transfer.Date, false, transfer.ToAmount);

            if (await _context.SaveChangesAsync() == 0)
                return Result<TransferDto>.Failure("Failed create transfer");

            // utworzenie obiektu DTO
            var transferDto = _mapper.Map<TransferDto>(transfer);

            return Result<TransferDto>.Success(transferDto);
        }
        private bool UpdateAccountBalances(Account account, DateTime newTransactionDate, bool isExpense, decimal newTransactionAmount)
        {
            // pobieramy saldo konta z najbliższego dnia przed datą nowej transakcji
            // (lub jeżeli jest to z tego samego dnia co nowa transakcja)
            var accountBalance = account.AccountBalances
                .Where(ab => ab.Date.Date <= newTransactionDate)
                .OrderByDescending(ab => ab.Date)
                .FirstOrDefault();

            // jeżeli nie znaleziono salda spełnającego warunki to brane jest najstarsze saldo
            accountBalance ??= account.AccountBalances.OrderBy(ab => ab.Date).FirstOrDefault();

            // sprawdzenie czy są wstarczające środki na koncie
            if (isExpense && accountBalance.Balance < newTransactionAmount)
                return false;

            // Aktualizacja sald
            foreach (var ab in account.AccountBalances.OrderByDescending(ab => ab.Date))
            {
                if (ab.Date.Date < newTransactionDate)
                    break;

                if (isExpense)
                    ab.Balance -= newTransactionAmount;
                else
                    ab.Balance += newTransactionAmount;
            }

            // Jeżeli nie istnieje saldo z tą samą datą, tworzymy nowy obiekt AccountBalance
            if (!account.AccountBalances.Any(ab => ab.Date.Date == newTransactionDate))
            {
                // Tworzenie nowego obiektu AccountBalance z datą z newTransaction.Date
                var newAccountBalance = new AccountBalance
                {
                    Date = newTransactionDate,
                    Account = account,
                    Currency = account.Currency,
                };

                if (newTransactionDate < accountBalance.Date.Date)
                    newAccountBalance.Balance = accountBalance.Balance;
                else
                    newAccountBalance.Balance = isExpense
                        ? accountBalance.Balance - newTransactionAmount
                        : accountBalance.Balance + newTransactionAmount;

                _context.AccountBalances.Add(newAccountBalance);
            }

            return true;
        }

        private void RestoreAccountBalances(int accountId, bool wasExpense, decimal amount, DateTime date)
        {
            var accountBalances = _context.AccountBalances
                .Where(ab => ab.AccountId == accountId)
                .OrderByDescending(ab => ab.Date).ToList();

            if (accountBalances.Count == 0)
                return;

            foreach (var ab in accountBalances)
            {
                if (ab.Date.Date < date.Date)
                    break;

                if (wasExpense)
                    ab.Balance += amount;
                else
                    ab.Balance -= amount;
            }
        }

        
    }
}

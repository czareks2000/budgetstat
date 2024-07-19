using Application.Core;
using Application.Dto.Transaction;
using Application.Interfaces;
using AutoMapper;
using Domain.Enums;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;
using AutoMapper.QueryableExtensions;
using Application.Dto.Transaction.Transfer;

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

        public async Task<Result<int>> Create(int accountId, TransactionCreateDto newTransaction)
        {   
            // sprawdzenie czy konto istnieje
            var account = await _context.Accounts
                .Include(a => a.Currency)
                .Include(a => a.AccountBalances)
                .FirstOrDefaultAsync(a => a.Id == accountId);

            if (account == null) return null;

            // sprawdzenie czy kategoria istnieje i czy nie jest głowną kategorią
            var user = await _utilities.GetCurrentUserAsync();

            var category = _context.Categories
                .Where(c => c.UserId == user.Id)
                .FirstOrDefault(category => category.Id == newTransaction.CategoryId);

            if (category == null || category.IsMain) 
                return Result<int>.Failure("Invalid category. It does not exist or is the main category");

            // utworzenie transakcji
            var transaction = _mapper.Map<Transaction>(newTransaction);

            transaction.Account = account;
            transaction.Currency = account.Currency;
            transaction.Category = category;

            var currentDate = DateTime.UtcNow;
            if (transaction.Date.Date > currentDate.Date)
                transaction.Planned = true;

            _context.Transactions.Add(transaction);

            // aktualizacja salda
            if (!transaction.Planned)
            {
                if (account.AccountBalances.Count == 0)
                    return Result<int>.Failure("The account has no balance");

                var isExpense = category.Type == TransactionType.Expense;

                var newTransactionDate = newTransaction.Date.Date;

                if (!_utilities.UpdateAccountBalances(account.Id, newTransactionDate, isExpense, newTransaction.Amount))
                    return Result<int>.Failure($"Insufficient funds in the account. Change the date or amount.");
            }

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<int>.Failure("Failed to create transaction");


            return Result<int>.Success(transaction.Id);
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
            if (transaction.Account != null && !transaction.Planned)
            {
                int accountId = (int)transaction.AccountId;
                var wasExpense = transaction.Category.Type == TransactionType.Expense;

                _utilities.RestoreAccountBalances(accountId, wasExpense, transaction.Amount, transaction.Date);
            }

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete transaction");

            return Result<object>.Success(null);
        }

        public async Task<Result<object>> Update(int transactionId, TransactionUpdateDto updatedTransaction)
        {
            // sprawdzenie czy transakcja istnieje
            var transaction = await _context.Transactions
                .Include(t => t.Account)
                .FirstOrDefaultAsync(t => t.Id == transactionId);

            if (transaction == null) return null;

            // walidacja kategorii
            var user = await _utilities.GetCurrentUserAsync();
            var newCategory = await _context.Categories
                .Where(c => c.UserId == user.Id)
                .FirstOrDefaultAsync(c => c.Id == updatedTransaction.CategoryId);

            if (newCategory == null || newCategory.IsMain)
                return Result<object>.Failure("Invalid category. It does not exist or is the main category");   

            // walidacja konta
            var newAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == updatedTransaction.AccountId && a.UserId == user.Id);

            if (newAccount == null)
                return Result<object>.Failure("Invalid account. It does not exist or does not belong to the user.");

            // aktualizacja salda nowego konta
            var isExpense = newCategory.Type == TransactionType.Expense;

            if (!_utilities.UpdateAccountBalances(newAccount.Id, transaction.Date, isExpense, updatedTransaction.Amount))
                return Result<object>.Failure("Insufficient funds in the account. Change the date or amount.");

            // aktualizacja salda starego konta
            if (transaction.Account != null)
            {
                int accountId = (int)transaction.AccountId;
                var wasExpense = transaction.Category.Type == TransactionType.Expense;

                _utilities.RestoreAccountBalances(accountId, wasExpense, transaction.Amount, transaction.Date);
            }

            // aktualizacja transakcji
            transaction.Account = newAccount;
            transaction.Category = newCategory;

            _mapper.Map(updatedTransaction, transaction);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to update transaction");

            return Result<object>.Success(null);
        }

        public async Task<Result<List<TransactionDto>>> CreatePlannedTransactions(int accountId, PlannedTransactionDto plannedTransaction)
        {
            // sprawdzenie czy konto istnieje
            var account = await _context.Accounts
                .Include(a => a.Currency)
                .FirstOrDefaultAsync(a => a.Id == accountId);

            if (account == null) return null;

            // sprawdzenie czy kategoria istnieje i czy nie jest głowną kategorią
            var user = await _utilities.GetCurrentUserAsync();
            var category = _context.Categories
                .Where(c => c.UserId == user.Id)
                .FirstOrDefault(category => category.Id == plannedTransaction.CategoryId);

            if (category == null || category.IsMain)
                return Result<List<TransactionDto>>.Failure("Invalid category. It does not exist or is the main category");

            // utworzenie transakcji w pętli przypisując im odpowiednie daty
            List<Transaction> transactions = new List<Transaction>();
            DateTime currentDate = plannedTransaction.StartDate;
            for (int i = 0; i < plannedTransaction.NumberOfTimes; i++)
            {
                transactions.Add(_mapper.Map<Transaction>(plannedTransaction));

                transactions[i].Account = account;
                transactions[i].Currency = account.Currency;
                transactions[i].Category = category;
                transactions[i].Planned = true;
                transactions[i].Date = currentDate;

                _context.Transactions.Add(transactions[i]);

                // Update currentDate based on the period and repeatsEvery
                currentDate = plannedTransaction.Period switch
                {
                    Period.Day => currentDate.AddDays((double)plannedTransaction.RepeatsEvery),
                    Period.Week => currentDate.AddDays(7 * (double)plannedTransaction.RepeatsEvery),
                    Period.Month => currentDate.AddMonths((int)plannedTransaction.RepeatsEvery),
                    Period.Year => currentDate.AddYears((int)plannedTransaction.RepeatsEvery),
                    _ => throw new ArgumentOutOfRangeException(),
                };
            }

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<List<TransactionDto>>.Failure("Failed to create transactions");

            // utworzenie obiektu DTO
            var transactionsDto = _mapper.Map<List<TransactionDto>>(transactions);

            return Result<List<TransactionDto>>.Success(transactionsDto);
        }

        public async Task<Result<object>> ConfirmTransaction(int transactionId)
        {
            // sprawdzenie czy istnieje
            var transaction = await _context.Transactions
                .Include(t => t.Account)
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == transactionId);

            if (transaction == null) return null;

            // sprawdzenie czy jest plannowana
            if (!transaction.Planned)
                return Result<object>.Failure("The transaction cannot be confirmed because it is not a planned transaction.");

            // zmiana planned na false
            var currentDate = DateTime.UtcNow;
            if (transaction.Date.Date > currentDate.Date)
                return Result<object>.Failure("The transaction cannot be confirmed because the date is in the future.");
            
            transaction.Planned = false;

            _context.Transactions.Update(transaction);

            // aktualizacja sald konta
            var isExpense = transaction.Category.Type == TransactionType.Expense;
            var accountId = transaction.Account.Id;

            if (!_utilities.UpdateAccountBalances(accountId, transaction.Date, isExpense, transaction.Amount))
                return Result<object>.Failure("Insufficient funds in the account. Change the date or amount.");

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to confirm transaction");

            return Result<object>.Success(null);
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
                .FirstOrDefaultAsync(a => a.Id == newTransfer.FromAccountId && a.UserId == user.Id);

            if (fromAccount == null)
                return Result<TransferDto>.Failure("Invalid FromAccount. It does not exist or does not belong to the user.");

            // sprawdzenie toAccount
            var toAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == newTransfer.ToAccountId && a.UserId == user.Id);

            if (toAccount == null)
                return Result<TransferDto>.Failure("Invalid ToAccount. It does not exist or does not belong to the user.");

            // utworzenie transferu
            var transfer = _mapper.Map<Transfer>(newTransfer);
            transfer.FromAccount = fromAccount;
            transfer.ToAccount = toAccount;

            _context.Transfers.Add(transfer);

            // aktualizacja sald kont
            if (!_utilities.UpdateAccountBalances(fromAccount.Id, transfer.Date, true, transfer.FromAmount))
                return Result<TransferDto>.Failure("Insufficient funds in the FromAccount. Change the date or amount.");

            _utilities.UpdateAccountBalances(toAccount.Id, transfer.Date, false, transfer.ToAmount);

            // zapisanie zmian w bazie
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
            _utilities.RestoreAccountBalances(transfer.FromAccountId, true, transfer.FromAmount, transfer.Date);
            _utilities.RestoreAccountBalances(transfer.ToAccountId, false, transfer.ToAmount, transfer.Date);

            // zapisanie zmian w bazie
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
            _utilities.RestoreAccountBalances(transfer.FromAccountId, true, transfer.FromAmount, transfer.Date);
            _utilities.RestoreAccountBalances(transfer.ToAccountId, false, transfer.ToAmount, transfer.Date);

            var user = await _utilities.GetCurrentUserAsync();

            // sprawdzenie fromAccount
            var fromAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == updatedTransfer.FromAccountId && a.UserId == user.Id);

            if (fromAccount == null)
                return Result<TransferDto>.Failure("Invalid FromAccount. It does not exist or does not belong to the user.");

            // sprawdzenie toAccount
            var toAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == updatedTransfer.ToAccountId && a.UserId == user.Id);

            if (toAccount == null)
                return Result<TransferDto>.Failure("Invalid ToAccount. It does not exist or does not belong to the user.");

            // aktualizacja transferu
            transfer.FromAccount = fromAccount;
            transfer.ToAccount = toAccount;

            _mapper.Map(updatedTransfer, transfer);

            _context.Transfers.Update(transfer);

            // aktualizacja sald kont
            if (!_utilities.UpdateAccountBalances(fromAccount.Id, transfer.Date, true, transfer.FromAmount))
                return Result<TransferDto>.Failure("Insufficient funds in the FromAccount. Change the date or amount.");

            _utilities.UpdateAccountBalances(toAccount.Id, transfer.Date, false, transfer.ToAmount);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<TransferDto>.Failure("Failed create transfer");

            // utworzenie obiektu DTO
            var transferDto = _mapper.Map<TransferDto>(transfer);

            return Result<TransferDto>.Success(transferDto);
        }

        public Task<Result<TransactionDto>> Get(int transactionId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<List<TransactionListItem>>> GetTransactions(TransactionParams transactionParams)
        {
            var user = await _utilities.GetCurrentUserAsync();

            // daty
            if (transactionParams.StartDate > transactionParams.EndDate)
                return Result<List<TransactionListItem>>.Failure("End date cannot be before start date.");

            // konta
            var accountIds = await _context.Accounts
                .Where(a => transactionParams.AccountIds.Contains(a.Id))
                .Where(a => a.UserId == user.Id)
                .Select(a => a.Id)
                .ToListAsync();

            // kategorie
            var categoryIds = await _context.Categories
                .Where(c => transactionParams.CategoryIds.Contains(c.Id))
                .Where(c => c.UserId == user.Id)
                .Select(c => c.Id)
                .ToListAsync();

            var subCategoriesOfMainCategories = await _context.Categories
                .Where(c => !c.IsMain)
                .Where(c => categoryIds.Contains((int)c.MainCategoryId))
                .Where(c => c.UserId == user.Id)
                .Select(c => c.Id)
                .ToListAsync();

            categoryIds.AddRange(subCategoriesOfMainCategories);

            List<TransactionListItem> transactions = new List<TransactionListItem>();

            // transakcje
            var transactionsQuery = _context.Transactions
                     .Where(t => t.Account.UserId == user.Id)
                     .Where(t => t.Date.Date >= transactionParams.StartDate.Date)
                     .Where(t => t.Date.Date <= transactionParams.EndDate.Date);

            if (transactionParams.Types.Count != 0)
                transactionsQuery = transactionsQuery
                     .Where(t => transactionParams.Types.Contains(t.Category.Type));

            if (accountIds.Count != 0)
                transactionsQuery = transactionsQuery
                    .Where(t => accountIds.Contains((int)t.AccountId));

            if (categoryIds.Count != 0)
                transactionsQuery = transactionsQuery
                    .Where(t => categoryIds.Contains(t.CategoryId));

            transactions = await transactionsQuery
                .Include(t => t.Currency)
                .Include(t => t.Category)
                .Include(t => t.Account)
                .ProjectTo<TransactionListItem>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // transfery 
            if (categoryIds.Count == 0 &&
                (transactionParams.Types.Contains(TransactionType.Transfer) || 
                 transactionParams.Types.Count == 0))
            {
                var transfersQuery = _context.Transfers
                    .Where(t => t.ToAccount.UserId == user.Id)
                    
                    .Where(t => t.Date.Date >= transactionParams.StartDate.Date)
                    .Where(t => t.Date.Date <= transactionParams.EndDate.Date);

                if (accountIds.Count != 0)
                    transfersQuery = transfersQuery
                        .Where(t => accountIds.Contains(t.ToAccountId));

                var transfers = await transfersQuery
                    .Include(t => t.FromAccount)
                    .Include(t => t.ToAccount)
                        .ThenInclude(a => a.Currency)
                    .ProjectTo<TransactionListItem>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                transactions.AddRange(transfers);
            }

            transactions = [.. transactions.OrderByDescending(t => t.Date.Date)];

            int index = 1;
            foreach (var transaction in transactions)
                transaction.Id = index++;

            return Result<List<TransactionListItem>>.Success(transactions);
        }
    }
}

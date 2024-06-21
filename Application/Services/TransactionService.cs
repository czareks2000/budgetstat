﻿using Application.Core;
using Application.Dto.Account;
using Application.Dto.Transactions;
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

        public async Task<Result<int>> Create(int accountId, TransactionCreateDto newTransaction)
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
                return Result<int>.Failure("Invalid category. It does not exist or is the main category");

            var isExpense = category.Type == TransactionType.Expense;

            var newTransactionDate = newTransaction.Date.Date;

            if (account.AccountBalances.Count == 0)
                return Result<int>.Failure("The account has no balance");

            // pobieramy saldo konta z najbliższego dnia przed datą nowej transakcji
            // (lub jeżeli jest to z tego samego dnia co nowa transakcja)
            var accountBalance = account.AccountBalances
                .Where(ab => ab.Date.Date <= newTransactionDate)
                .OrderByDescending(ab => ab.Date)
                .FirstOrDefault();

            // jeżeli nie znaleziono salda spełnającego warunki to brane jest najstarsze saldo
            accountBalance ??= account.AccountBalances.OrderBy(ab => ab.Date).FirstOrDefault();

            // sprawdzenie czy są wstarczające środki na koncie
            if (isExpense && accountBalance.Balance < newTransaction.Amount)
                return Result<int>.Failure($"Insufficient funds in the account ({accountBalance.Balance}). Change the date or amount.");

            // Aktualizacja sald
            foreach (var ab in account.AccountBalances.OrderByDescending(ab => ab.Date))
            {
                if (ab.Date.Date < newTransactionDate)
                    break;

                if (isExpense)
                    ab.Balance -= newTransaction.Amount;
                else
                    ab.Balance += newTransaction.Amount;
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
                        ? accountBalance.Balance - newTransaction.Amount
                        : accountBalance.Balance + newTransaction.Amount;

                _context.AccountBalances.Add(newAccountBalance);
            }

            // utworzenie transakcji
            var transaction = _mapper.Map<Transaction>(newTransaction);

            transaction.Account = account;
            transaction.Currency = account.Currency;
            transaction.Category = category;

            _context.Transactions.Add(transaction);

            if (await _context.SaveChangesAsync() == 0)
                return Result<int>.Failure("Failed to create transaction");

            return Result<int>.Success(transaction.Id);
        }

        public async Task<Result<object>> Delete(int transactionId)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == transactionId);

            if (transaction == null) return null;

            _context.Transactions.Remove(transaction);

            // aktualizacja sald konta

            var accountBalances = _context.AccountBalances
                .Where(ab => ab.AccountId == transaction.AccountId)
                .OrderByDescending(ab => ab.Date).ToList();

            var isExpense = transaction.Category.Type == TransactionType.Expense;

            foreach (var ab in accountBalances)
            {
                if (ab.Date.Date < transaction.Date.Date)
                    break;

                if (isExpense)
                    ab.Balance += transaction.Amount;
                else
                    ab.Balance -= transaction.Amount;
            }

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete transaction");

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

        public async Task<Result<TransactionDto>> Update(int transactionId, TransactionUpdateDto updatedTransaction)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Account)
                    .ThenInclude(a => a.AccountBalances)
                .FirstOrDefaultAsync(t => t.Id == transactionId);

            if (transaction == null) return null;

            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == updatedTransaction.CategoryId);

            if (category == null || category.IsMain)
                return Result<TransactionDto>.Failure("Invalid category. It does not exist or is the main category");

            var currency = await _context.Currencies
                .FirstOrDefaultAsync(c => c.Id == updatedTransaction.CurrencyId);

            if (currency == null)
                return Result<TransactionDto>.Failure("Invalid currency");

            var user = await _utilities.GetCurrentUserAsync();

            var newAccount = await _context.Accounts
                .Include(a => a.AccountBalances)
                .FirstOrDefaultAsync(a => a.Id == updatedTransaction.AccountId && a.UserId == user.Id);

            if (newAccount == null)
                return Result<TransactionDto>.Failure("Invalid account. It does not exist or does not belong to the user.");

            transaction.Category = category;
            // przy zmianie waluty, wartość transakcji nie jest zmieniana
            transaction.Currency = currency;

            if (transaction.AccountId != newAccount.Id)
            {
                var oldAccount = transaction.Account;
                transaction.Account = newAccount;

                // dodać aktualizację sald starego i nowego konta
            }

            _mapper.Map(updatedTransaction, transaction);

            if (await _context.SaveChangesAsync() == 0)
                return Result<TransactionDto>.Failure("Failed to update transaction");

            var transactionDto = _mapper.Map<TransactionDto>(transaction);

            return Result<TransactionDto>.Success(transactionDto);
        }

        public Task<Result<object>> ConfirmTransaction(int transactionId)
        {
            throw new NotImplementedException();
        }
    }
}

using Application.Core;
using Application.Dto.Transaction;
using Application.Dto.Transaction.Transfer;
using Domain.Enums;

namespace Application.Interfaces
{
    public interface ITransactionService
    {
        // wprowadzenie transakcji
        Task<Result<int>> Create(int accountId, TransactionCreateDto newTransaction);
        // zaplanowanie transakcji (zmienić zwracany typ?? zeby po zwróceniu można było wyświetlać dobrze na transactions/planned
        Task<Result<List<PlannedTransactionDto>>> CreatePlannedTransactions(int accountId, PlannedTransactionCreateDto plannedTransaction);
        // potwierdzenie zaplanowanej transakcji 
        Task<Result<object>> ConfirmTransaction(int transactionId);
        // edycja transakcji 
        Task<Result<object>> Update(int transactionId, TransactionUpdateDto updatedTransaction);
        // zmiana pola considered
        Task<Result<bool>> ToggleConsideredFlag(int transactionId);
        // usunięcie transakcji
        Task<Result<object>> Delete(int transactionId);
        
        // wprowadzanie transferu
        Task<Result<TransferDto>> Create(TransferCreateUpdateDto newTransfer);
        // usunięcie transferu
        Task<Result<int>> DeleteTransfer(int transferId);
        // edycja transferu
        Task<Result<TransferDto>> Update(int transferId, TransferCreateUpdateDto updatedTransfer);

        // szczególy transakcji (potrzebne do edycji)
        Task<Result<TransactionFormValues>> Get(int transactionId, TransactionType type);
        // przegląd transakcji
        Task<Result<List<TransactionListItem>>> GetTransactions(TransactionParams transactionParams);
        // przegląd zaplanowanych transakcji
        Task<Result<List<PlannedTransactionDto>>> GetPlannedTransactions(bool onlyTransactionsUpToTomorow = false);
    }
}

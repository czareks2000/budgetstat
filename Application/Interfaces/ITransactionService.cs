using Application.Core;
using Application.Dto.Transaction;
using Application.Dto.Transfer;

namespace Application.Interfaces
{
    public interface ITransactionService
    {
        // wprowadzenie transakcji
        Task<Result<int>> Create(int accountId, TransactionCreateDto newTransaction);
        // zaplanowanie transakcji
        Task<Result<List<TransactionDto>>> CreatePlannedTransactions(int accountId, PlannedTransactionDto plannedTransaction);
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
        Task<Result<object>> DeleteTransfer(int transferId);
        // edycja transferu
        Task<Result<TransferDto>> Update(int transferId, TransferCreateUpdateDto updatedTransfer);

        // przegląd transakcji

        // przegląd transferów

        // wyświetlenie kalendarza transakcji
    }
}

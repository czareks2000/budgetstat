using Application.Core;
using Application.Dto.Budget;
using Application.Dto.Transactions;

namespace Application.Interfaces
{
    public interface ITransactionService
    {
        // wprowadzenie transakcji
        Task<Result<int>> Create(int accountId, TransactionCreateDto newTransaction);
        // zaplanowanie transakcji
        // potwierdzenie zaplanowanej transakcji 
        Task<Result<object>> ConfirmTransaction(int transactionId);
        // edycja transakcji 
        Task<Result<TransactionDto>> Update(int transactionId, TransactionUpdateDto updatedTransaction);
        // zmiana pola considered
        Task<Result<bool>> ToggleConsideredFlag(int transactionId);
        // usunięcie transakcji
        Task<Result<object>> Delete(int transactionId);
        // przegląd transakcji
        // wyświetlenie kalendarza transakcji

        // wprowadzanie transferu
        // usunięcie transferu
        // edycja transferu
    }
}

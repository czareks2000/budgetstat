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
        // edycja transakcji 
        // usunięcie transakcji
        Task<Result<object>> Delete(int transactionId);
        // przegląd transakcji
        // wyświetlenie kalendarza transakcji

        // wprowadzanie transferu
        // usunięcie transferu
        // edycja transferu
    }
}

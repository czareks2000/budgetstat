using Application.Core;
using Application.Dto.Transaction;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IFileService
    {
        // import transakcji z pliku
        Task<Result<List<TransactionListItem>>> ImportTransactions(IFormFile file);

        // export danych aplikacji json
        Task<MemoryStream> GetAppDataJsonZip();

        // export danych aplikacji csv
        Task<MemoryStream> GetAppDataCsvZip();
    }
}

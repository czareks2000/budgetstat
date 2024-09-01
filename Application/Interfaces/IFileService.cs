namespace Application.Interfaces
{
    public interface IFileService
    {
        // import transakcji z pliku json

        // export danych aplikacji json
        Task<MemoryStream> GetAppDataJsonZip();

        // export danych aplikacji csv
        Task<MemoryStream> GetAppDataCsvZip();
    }
}

using Application.Core;
using Application.Dto.Export;
using Application.Dto.Transaction;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CsvHelper;
using CsvHelper.Configuration;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Persistence;
using System.Globalization;
using System.IO.Compression;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Dto.Import;

namespace Application.Services
{
    public class FileService(
        DataContext context,
        ITransactionService transactionService,
        IUtilities utilities,
        IMapper mapper) : IFileService
    {
        private readonly DataContext _context = context;
        private readonly ITransactionService _transactionService = transactionService;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<MemoryStream> GetAppDataCsvZip()
        {
            var user = await _utilities.GetCurrentUserAsync();

            // Get objects from db
            var accounts = await _context.Accounts
                .Include(a => a.Currency)
                .Where(a => a.UserId == user.Id).ToListAsync();
            var accountsBalances = await _context.AccountBalances
                .Include(ab => ab.Currency)
                .Where(ab => ab.Account.UserId == user.Id)
                .OrderByDescending(ab => ab.Date)
                .ToListAsync();

            var assets = await _context.Assets
                .Include(a => a.AssetCategory)
                .Where(a => a.UserId == user.Id).ToListAsync();
            var assetsValues = await _context.AssetValues
                .Include(av => av.Currency)
                .Where(av => av.Asset.UserId == user.Id)
                .OrderByDescending(ab => ab.Date)
                .ToListAsync();

            var categories = await _context.Categories
                .Where(a => a.UserId == user.Id).ToListAsync();

            var loans = await _context.Loans
                .Include(l => l.Counterparty)
                .Where(a => a.UserId == user.Id)
                .Where(l => l.LoanStatus == LoanStatus.InProgress)
                .ToListAsync();

            var transactionsQuery = _context.Users
                .Where(u => u.Id == user.Id)
                .Include(u => u.Transactions)
                .SelectMany(u => u.Transactions)
                .Where(t => !t.Planned);

            var transfersQuery = _context.Transfers
                .Where(t => t.ToAccount.UserId == user.Id);

            // Creating Dto objects (with fields as they will be in the csv file) 
            var accountsDto = _mapper.Map<List<AccountExportDto>>(accounts);
            var accountsBalancesDto = _mapper.Map<List<AccountBalanceExportDto>>(accountsBalances);

            var assetsDto = _mapper.Map<List<AssetExportDto>>(assets);
            var assetsValuesDto = _mapper.Map<List<AssetValueExportDto>>(assetsValues);

            var categoriesDto = _mapper.Map<List<CategoryExportDto>>(categories);

            var loansDto = _mapper.Map<List<LoanExportDto>>(loans);

            List<TransactionExportDto> transactionsDto = new List<TransactionExportDto>();
            transactionsDto = await transactionsQuery
                .Include(t => t.Currency)
                .Include(t => t.Category)
                .Include(t => t.Account)
                .ProjectTo<TransactionExportDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var transfers = await transfersQuery
                .Include(t => t.FromAccount)
                .Include(t => t.ToAccount)
                    .ThenInclude(a => a.Currency)
                .ProjectTo<TransactionExportDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            transactionsDto.AddRange(transfers);

            transactionsDto = [.. transactionsDto.OrderByDescending(t => t.Date)];

            int index = 1;
            foreach (var transaction in transactionsDto)
                transaction.Id = index++;


            // Creating a ZIP archive in memory
            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                AddCsvToArchive(archive, "accounts.csv", accountsDto);
                AddCsvToArchive(archive, "accountsBalances.csv", accountsBalancesDto);
                AddCsvToArchive(archive, "assets.csv", assetsDto);
                AddCsvToArchive(archive, "assetsValues.csv", assetsValuesDto);
                AddCsvToArchive(archive, "categories.csv", categoriesDto);
                AddCsvToArchive(archive, "loans.csv", loansDto);
                AddCsvToArchive(archive, "transations.csv", transactionsDto);
            }

            // Returning a MemoryStream object containing the ZIP archive
            return memoryStream;
        }

        private static void AddCsvToArchive<T>(ZipArchive archive, string fileName, IEnumerable<T> records)
        {
            var entry = archive.CreateEntry(fileName);
            using (var writer = new StreamWriter(entry.Open()))
            using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)))
            {
                csv.WriteRecords(records);
            }
        }

        public async Task<MemoryStream> GetAppDataJsonZip()
        {
            var user = await _utilities.GetCurrentUserAsync();

            // Get objects from db
            var accounts = await _context.Accounts
                .Include(a => a.Currency)
                .Where(a => a.UserId == user.Id).ToListAsync();
            var accountsBalances = await _context.AccountBalances
                .Include(ab => ab.Currency)
                .Where(ab => ab.Account.UserId == user.Id)
                .OrderByDescending(ab => ab.Date)
                .ToListAsync();

            var assets = await _context.Assets
                .Include(a => a.AssetCategory)
                .Where(a => a.UserId == user.Id).ToListAsync();
            var assetsValues = await _context.AssetValues
                .Include(av => av.Currency)
                .Where(av => av.Asset.UserId == user.Id)
                .OrderByDescending(ab => ab.Date)
                .ToListAsync();

            var categories = await _context.Categories
                .Where(a => a.UserId == user.Id).ToListAsync();

            var loans = await _context.Loans
                .Include(l => l.Counterparty)
                .Where(a => a.UserId == user.Id)
                .Where(l => l.LoanStatus == LoanStatus.InProgress)
                .ToListAsync();

            var transactionsQuery = _context.Users
                .Where(u => u.Id == user.Id)
                .Include(u => u.Transactions)
                .SelectMany(u => u.Transactions)
                .Where(t => !t.Planned);

            var transfersQuery = _context.Transfers
                .Where(t => t.ToAccount.UserId == user.Id);

            // Creating Dto objects (with fields as they will be in the csv file) 
            var accountsDto = _mapper.Map<List<AccountExportDto>>(accounts);
            var accountsBalancesDto = _mapper.Map<List<AccountBalanceExportDto>>(accountsBalances);

            var assetsDto = _mapper.Map<List<AssetExportDto>>(assets);
            var assetsValuesDto = _mapper.Map<List<AssetValueExportDto>>(assetsValues);

            var categoriesDto = _mapper.Map<List<CategoryExportDto>>(categories);

            var loansDto = _mapper.Map<List<LoanExportDto>>(loans);

            List<TransactionExportDto> transactionsDto = new List<TransactionExportDto>();
            transactionsDto = await transactionsQuery
                .Include(t => t.Currency)
                .Include(t => t.Category)
                .Include(t => t.Account)
                .ProjectTo<TransactionExportDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var transfers = await transfersQuery
                .Include(t => t.FromAccount)
                .Include(t => t.ToAccount)
                    .ThenInclude(a => a.Currency)
                .ProjectTo<TransactionExportDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            transactionsDto.AddRange(transfers);

            transactionsDto = [.. transactionsDto.OrderByDescending(t => t.Date)];

            int index = 1;
            foreach (var transaction in transactionsDto)
                transaction.Id = index++;


            // Creating a ZIP archive in memory
            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                AddJsonToArchive(archive, "accounts.json", accountsDto);
                AddJsonToArchive(archive, "accountsBalances.json", accountsBalancesDto);
                AddJsonToArchive(archive, "assets.json", assetsDto);
                AddJsonToArchive(archive, "assetsValues.json", assetsValuesDto);
                AddJsonToArchive(archive, "categories.json", categoriesDto);
                AddJsonToArchive(archive, "loans.json", loansDto);
                AddJsonToArchive(archive, "transactions.json", transactionsDto);
            }

            // Returning a MemoryStream object containing the ZIP archive
            return memoryStream;
        }

        private static void AddJsonToArchive<T>(ZipArchive archive, string fileName, IEnumerable<T> records)
        {
            var entry = archive.CreateEntry(fileName);
            using (var writer = new StreamWriter(entry.Open()))
            {
                var options = new JsonSerializerOptions
                {
                    WriteIndented = true,
                    Converters = { new JsonStringEnumConverter() },
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                };

                string json = JsonSerializer.Serialize(records, options);

                writer.Write(json);
            }
        }

        public async Task<Result<List<TransactionListItem>>> ImportTransactions(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Result<List<TransactionListItem>>.Failure("No file uploaded.");

            var fileExtension = Path.GetExtension(file.FileName);
            if (fileExtension != ".csv")
                return Result<List<TransactionListItem>>.Failure("Invalid file format.");

            List<TransactionImportDto> importedTransactions = new();
            
            try
            {
                using var stream = file.OpenReadStream();
                importedTransactions = ProcessCsv(stream);
            }
            catch (Exception)
            {
                return Result<List<TransactionListItem>>.Failure("The content of the file is not in the correct format.");
            }

            List<int> transactionIds = []; // id utworzonych transakcji

            var user = await _utilities.GetCurrentUserAsync();

            var filteredAndSortedTransactions = importedTransactions
                .Where(t => t.Type != TransactionType.Transfer)  
                .OrderBy(t => t.Type)  
                .ThenBy(t => t.Date)
                .ToList();

            foreach (var transaction in filteredAndSortedTransactions)
            {
                var categoryId = await _context.Categories
                    .Where(c => c.UserId == user.Id)
                    .Where(c => !c.IsMain)
                    .Where(c => c.Name == transaction.Category)
                    .Where(c => c.MainCategory.Name == transaction.MainCategory)
                    .Where(c => c.Type == transaction.Type)
                    .Select(c => c.Id)
                    .SingleOrDefaultAsync();

                if (categoryId == 0)
                    return await CancelImport(transactionIds, $"Category not found: {transaction.MainCategory}/{transaction.Category}");

                var accountId = await _context.Accounts
                    .Where(a => a.UserId == user.Id)
                    .Where(a => a.Name == transaction.Account)
                    .Where(a => a.Currency.Code == transaction.Currency)
                    .Select(c => c.Id)
                    .SingleOrDefaultAsync();

                if (accountId == 0)
                    return await CancelImport(transactionIds, $"Account not found: {transaction.Account} ({transaction.Currency})");

                var newTransaction = new TransactionCreateDto
                {
                    Amount = transaction.Amount,
                    CategoryId = categoryId,
                    Date = DateTime.SpecifyKind(transaction.Date, DateTimeKind.Utc),
                    Description = transaction.Description,
                    Considered = transaction.Considered
                };

                var result = await _transactionService.Create(accountId, newTransaction);

                if (!result.IsSucess)
                    return await CancelImport(transactionIds, result.Error);

                transactionIds.Add(result.Value);
            }

            // zwrócenie dodanych transakcji
            var transactions = await _context.Transactions
                .Where(t => transactionIds.Contains(t.Id))
                .Include(t => t.Currency)
                .Include(t => t.Category)
                .Include(t => t.Account)
                .OrderBy(t => t.Date)
                .ProjectTo<TransactionListItem>(_mapper.ConfigurationProvider)
                .ToListAsync();

            int index = 1;
            foreach (var transaction in transactions)
                transaction.Id = index++;

            return Result<List<TransactionListItem>>.Success(transactions);
        }

        private List<TransactionImportDto> ProcessCsv(Stream stream)
        {
            // Przetwarzanie pliku CSV
            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            var transactions = csv.GetRecords<TransactionImportDto>().ToList();

            return transactions;
        }

        private async Task<Result<List<TransactionListItem>>> CancelImport(List<int> transactionIds, string message)
        {
            foreach (var transactionId in transactionIds)
                await _transactionService.Delete(transactionId);

            return Result<List<TransactionListItem>>
                        .Failure(message);
        }
    }
}

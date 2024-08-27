using Application.Dto.Csv;
using Application.Interfaces;
using AutoMapper;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Globalization;
using System.IO.Compression;

namespace Application.Services
{
    public class FileService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : IFileService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<MemoryStream> GetAppDataCsvZip()
        {
            var user = await _utilities.GetCurrentUserAsync();

            // Get objects from db
            var accounts = await _context.Accounts.Where(a => a.UserId == user.Id).ToListAsync();

            // Creating Dto objects (with fields as they will be in the csv file) 
            var accountsDto = _mapper.Map<List<AccountCsvDto>>(accounts);

            // Creating a ZIP archive in memory
            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                // Adding the goals.csv file to the archive
                var accountsCsvEntry = archive.CreateEntry("accounts.csv");
                using var writer = new StreamWriter(accountsCsvEntry.Open());
                using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)))
                {
                    csv.WriteRecords(accountsDto);
                }
            }

            // Returning a MemoryStream object containing the ZIP archive
            return memoryStream;
        }
    }
}

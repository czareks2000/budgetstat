using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FileController(
        IFileService fileService) : BaseApiController
    {
        private readonly IFileService _fileService = fileService;

        [HttpGet("files/app-data-csv-zip")]
        public async Task<IActionResult> GetAppDataCsvZip()
        {
            try
            {
                var zipArchive = await _fileService.GetAppDataCsvZip();

                return File(zipArchive.ToArray(), "application/zip", "budgetstat.zip");
            }
            catch (Exception)
            {
                return StatusCode(500, $"An error occurred during generating zip file");
            }
        }

        [HttpGet("files/app-data-json-zip")]
        public async Task<IActionResult> GetAppDataJsonZip()
        {
            try
            {
                var zipArchive = await _fileService.GetAppDataJsonZip();

                return File(zipArchive.ToArray(), "application/zip", "budgetstat.zip");
            }
            catch (Exception)
            {
                return StatusCode(500, $"An error occurred during generating zip file");
            }
        }
    }
}

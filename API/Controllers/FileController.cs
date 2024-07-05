using Application.Interfaces;

namespace API.Controllers
{
    public class FileController(
        IFileService fileService) : BaseApiController
    {
        private readonly IFileService _fileService = fileService;
    }
}

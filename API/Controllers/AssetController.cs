using Application.Interfaces;

namespace API.Controllers
{
    public class AssetController(
        IAssetService assetService) : BaseApiController
    {
        private readonly IAssetService _assetService = assetService;
    }
}

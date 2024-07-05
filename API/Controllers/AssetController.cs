using Application.Dto.Asset;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AssetController(
        IAssetService assetService) : BaseApiController
    {
        private readonly IAssetService _assetService = assetService;

        [HttpGet("assets/categories")] //api/assets/categories
        public async Task<IActionResult> GetAssetCategories()
        {
            return HandleResult(await _assetService.GetAssetCategories());
        }

        [HttpGet("assets")] //api/assets
        public async Task<IActionResult> GetAssets()
        {
            return HandleResult(await _assetService.GetAssets());
        }

        [HttpPost("assets")] //api/assets
        public async Task<IActionResult> CreateAsset(AssetCreateUpdateDto newAsset)
        {
            return HandleResult(await _assetService.CreateAsset(newAsset));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("assets/{assetId}")] //api/assets/{assetId}
        public async Task<IActionResult> GetAssets(int assetId)
        {
            return HandleResult(await _assetService.DeleteAsset(assetId));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPut("assets/{assetId}")] //api/assets/{assetId}
        public async Task<IActionResult> UpdateAsset(int assetId, AssetCreateUpdateDto updatedAsset)
        {
            return HandleResult(await _assetService.UpdateAsset(assetId, updatedAsset));
        }
    }
}

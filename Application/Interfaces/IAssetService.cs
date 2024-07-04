using Application.Core;
using Application.Dto.Asset;

namespace Application.Interfaces
{
    public interface IAssetService
    {
        // przegląd kategorii zasobów
        Task<Result<List<AssetCategoryDto>>> GetAssetCategories();

        // dodanie zasobu
        Task<Result<AssetDto>> CreateAsset(AssetCreateDto newAsset);
        // usunięcie zasobu
        Task<Result<object>> DeleteAsset(int assetId);
        // edycja zasobu
        Task<Result<AssetDto>> UpdateAsset(int assedId, AssetUpdateDto updatedAsset);
        // przegląd zasobów (wartości assetów powinny być przeliczone do defaultowej waluty)
        Task<Result<List<AssetDto>>> GetAssets();
    }
}

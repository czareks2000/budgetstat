using Application.Core;
using Application.Dto.Asset;

namespace Application.Interfaces
{
    public interface IAssetService
    {
        // przegląd kategorii zasobów
        Task<Result<List<AssetCategoryDto>>> GetAssetCategories();

        // dodanie zasobu
        Task<Result<AssetDto>> CreateAsset(AssetCreateUpdateDto newAsset);
        // usunięcie zasobu
        Task<Result<object>> DeleteAsset(int assetId);
        // edycja zasobu
        Task<Result<AssetDto>> UpdateAsset(int assetId, AssetCreateUpdateDto updatedAsset);
        // przegląd zasobów (wartości assetów w ich orginalnych walutach)
        Task<Result<List<AssetDto>>> GetAssets();

        // dodanie asset value
        Task<Result<AssetDto>> CreateAssetValue(int assetId, AssetValueCreateDto newAssetValue);
        // usuniecie asset value
        Task<Result<AssetDto>> DeleteAssetValue(int assetValueId);
        // przegląd asset values
        Task<Result<List<AssetValueDto>>> GetAssetValues(int assetId);
    }
}

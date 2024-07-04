using Application.Core;
using Application.Dto.Asset;
using Application.Interfaces;
using AutoMapper;
using Persistence;

namespace Application.Services
{
    public class AssetService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : IAssetService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public Task<Result<AssetDto>> CreateAsset(AssetCreateDto newAsset)
        {
            throw new NotImplementedException();
        }

        public Task<Result<object>> DeleteAsset(int assetId)
        {
            throw new NotImplementedException();
        }

        public Task<Result<List<AssetCategoryDto>>> GetAssetCategories()
        {
            throw new NotImplementedException();
        }

        public Task<Result<List<AssetDto>>> GetAssets()
        {
            throw new NotImplementedException();
        }

        public Task<Result<AssetDto>> UpdateAsset(int assedId, AssetUpdateDto updatedAsset)
        {
            throw new NotImplementedException();
        }
    }
}

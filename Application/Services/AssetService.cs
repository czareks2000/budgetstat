using Application.Core;
using Application.Dto.Asset;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Microsoft.EntityFrameworkCore;
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

        public async Task<Result<AssetDto>> CreateAsset(AssetCreateUpdateDto newAsset)
        {
            // sprawdzenie kategorii
            var assetCategory = await _context.AssetCategories
                .FirstOrDefaultAsync(ac => ac.Id == newAsset.AssetCategoryId);

            if (assetCategory == null)
                return Result<AssetDto>.Failure("Invalid asset category id");

            // sprawdzenie waluty
            var currency = await _context.Currencies
                .FirstOrDefaultAsync(c => c.Id == newAsset.CurrencyId);

            if (currency == null)
                return Result<AssetDto>.Failure("Invalid currency id");

            // utworzenie obiektu AssetValue
            var assetValue = new AssetValue
            {
                Value = newAsset.AssetValue,
                Currency = currency,
                Date = newAsset.Date,
            };

            // utworzenie assetu
            var asset = _mapper.Map<Asset>(newAsset);
            asset.User = await _utilities.GetCurrentUserAsync();
            asset.AssetCategory = assetCategory;
            asset.AssetValues = new List<AssetValue>([assetValue]);

            _context.Assets.Add(asset);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<AssetDto>.Failure("Failed to create asset");

            // utworzenie obiektu DTO
            var assetDto = _mapper.Map<AssetDto>(asset);

            return Result<AssetDto>.Success(assetDto);
        }

        public async Task<Result<object>> DeleteAsset(int assetId)
        {
            var asset = await _context.Assets
                .FirstOrDefaultAsync(c => c.Id == assetId);

            if (asset == null) return null;

            _context.Assets.Remove(asset);

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete asset");

            return Result<object>.Success(null);
        }

        public async Task<Result<List<AssetCategoryDto>>> GetAssetCategories()
        {
            var assetCategories = await _context.AssetCategories
                .ProjectTo<AssetCategoryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<AssetCategoryDto>>.Success(assetCategories);
        }

        public async Task<Result<List<AssetDto>>> GetAssets()
        {
            var user = await _utilities.GetCurrentUserAsync();

            var assets = await _context.Assets
                .Where(a => a.UserId == user.Id)
                .ProjectTo<AssetDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<AssetDto>>.Success(assets);
        }

        public async Task<Result<AssetDto>> UpdateAsset(int assetId, AssetCreateUpdateDto updatedAsset)
        {
            // sprawdzenie czy istnieje
            var asset = await _context.Assets
                .Include(a => a.AssetValues)
                .FirstOrDefaultAsync(a => a.Id == assetId);

            if (asset == null) return null;

            // sprawdzenie waluty
            var currency = await _context.Currencies
                .FirstOrDefaultAsync(c => c.Id == updatedAsset.CurrencyId);

            if (currency == null)
                return Result<AssetDto>.Failure("Invalid currency id");

            // utworzenie obiektu AssetValue
            var assetValue = new AssetValue
            {
                Value = updatedAsset.AssetValue,
                Currency = currency,
                Date = updatedAsset.Date,
            };

            // aktualizacja assetu
            _mapper.Map(updatedAsset, asset);
            asset.AssetValues.Add(assetValue);

            _context.Assets.Update(asset);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<AssetDto>.Failure("Failed to update asset");

            // utworzenie obiektu DTO
            var assetDto = _mapper.Map<AssetDto>(asset);

            return Result<AssetDto>.Success(assetDto);
        }
    }
}

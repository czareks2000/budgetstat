using Application.Core;
using Application.Dto.Asset;
using Application.Dto.Loan;
using Application.Dto.Stats;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class StatsService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : IStatsService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<NetWorthStats>> GetNetWorthStats()
        {
            var user = await _utilities.GetCurrentUserAsync();

            // loans value
            var loans = await _context.Loans
                .Include(l => l.Currency)
                .Where(l => l.UserId == user.Id)
                .Where(l => l.LoanStatus == LoanStatus.InProgress)
                .ToListAsync();

            decimal loansValue = 0;

            foreach (var loan in loans)
            {
                var missingAmount = loan.FullAmount - loan.CurrentAmount;

                var convertedMissingAmount = await _utilities
                    .Convert(loan.Currency.Code, user.DefaultCurrency.Code, missingAmount);

                if (loan.LoanType == LoanType.Credit)
                    loansValue += convertedMissingAmount;
                else if (loan.LoanType == LoanType.Debt)
                    loansValue -= convertedMissingAmount;
            }

            // assets values by categories
            var assets = await _context.Assets
                .Where(a => a.UserId == user.Id)
                .ProjectTo<AssetDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            Dictionary<int, decimal> valuesGroupedByCategory = [];

            foreach (var asset in assets)
            {
                var assetCurrency = await _context.Currencies
                    .FirstAsync(c => c.Id == asset.CurrencyId);

                var convertedValue = await _utilities
                    .Convert(assetCurrency.Code, user.DefaultCurrency.Code, asset.AssetValue);

                if (valuesGroupedByCategory.ContainsKey(asset.AssetCategoryId))
                {
                    valuesGroupedByCategory[asset.AssetCategoryId] += convertedValue;
                }
                else
                {
                    valuesGroupedByCategory[asset.AssetCategoryId] = convertedValue;
                }
            }

            List<AssetsCategoryValue> assetsCategoryValues = valuesGroupedByCategory
                .Select(kvp => new AssetsCategoryValue
                {
                    AssetCategoryId = kvp.Key,
                    Value = kvp.Value
                })
                .ToList();

            // create result object
            var netWorthStats = new NetWorthStats
            {
                LoansValue = loansValue,
                AssetsValues = assetsCategoryValues
            };

            return Result<NetWorthStats>.Success(netWorthStats);
        }
    }
}

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

        public async Task<Result<NetWorthStats>> GetNetWorthStats(bool loans = true, bool assets = true)
        {
            var user = await _utilities.GetCurrentUserAsync();

            var netWorthStats = new NetWorthStats
            {
                LoansValue = 0,
                AssetsValues = []
            };

            if (loans)
                netWorthStats.LoansValue = await GetLoansValue(user);
            
            if (assets)
                netWorthStats.AssetsValues = await AssetsValues(user);

            return Result<NetWorthStats>.Success(netWorthStats);
        }

        private async Task<decimal> GetLoansValue(User user)
        {
            // loans value
            var loanList = await _context.Loans
                .Include(l => l.Currency)
                .Where(l => l.UserId == user.Id)
                .Where(l => l.LoanStatus == LoanStatus.InProgress)
                .ToListAsync();

            decimal loansValue = 0;

            foreach (var loan in loanList)
            {
                var missingAmount = loan.FullAmount - loan.CurrentAmount;

                var convertedMissingAmount = await _utilities
                    .Convert(loan.Currency.Code, user.DefaultCurrency.Code, missingAmount);

                if (loan.LoanType == LoanType.Credit)
                    loansValue += convertedMissingAmount;
                else if (loan.LoanType == LoanType.Debt)
                    loansValue -= convertedMissingAmount;
            }

            return loansValue;
        }

        private async Task<List<AssetsCategoryValue>> AssetsValues(User user)
        {
            // assets values by categories
            var assetList = await _context.Assets
                .Where(a => a.UserId == user.Id)
                .ProjectTo<AssetDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            Dictionary<int, decimal> valuesGroupedByCategory = [];

            foreach (var asset in assetList)
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
            
            return assetsCategoryValues;
        }
    }
}

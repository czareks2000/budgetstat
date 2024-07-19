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

        public async Task<Result<NetWorthValueOverTime>> GetNetWorthValueOverTime(ChartPeriod period)
        {   
            var user = await _utilities.GetCurrentUserAsync();

            // filter assets by dates
            var assets = await _context.Assets
                .Include(a => a.AssetValues)
                    .ThenInclude(av => av.Currency)
                .Where(a => a.UserId == user.Id)
                .ToListAsync();

            // create result object
            NetWorthValueOverTime chartObject = new()
            {
                Period = period,
                Data = [],
                Labels = [],
            };

            // calculate start and end dates
            var timeWindow = CalculateTimeWindow(period, assets);

            chartObject.StartDate = timeWindow.StartDate;
            chartObject.EndDate = timeWindow.EndDate;

            // calculate date labels
            var dates = CalculateDates(period, timeWindow);

            // calculate data
            var accounts = await _context.Accounts
                .Include(a => a.AccountBalances)
                    .ThenInclude(ab => ab.Currency)
                .Where(a => a.UserId == user.Id)
                .Where(a => a.Status == AccountStatus.Visible)
                .ToListAsync();

            foreach (var date in dates) 
            {
                decimal value = 0;

                // asset value
                foreach (var asset in assets)
                {
                    var assetValue = asset.AssetValues
                        .Where(av => av.Date.Date <= date.Date)
                        .OrderByDescending(ab => ab.Date)
                        .FirstOrDefault();

                    if (assetValue == null) continue;

                    value += await _utilities.Convert(assetValue.Currency.Code, user.DefaultCurrency.Code, assetValue.Value, date);
                }
                // accounts value
                foreach (var account in accounts)
                {
                    var accountBalance = account.AccountBalances
                        .Where(ab => ab.Date.Date <= date.Date)
                        .OrderByDescending(ab => ab.Date)
                        .FirstOrDefault();

                    if (accountBalance == null) continue;

                    value += await _utilities.Convert(accountBalance.Currency.Code, user.DefaultCurrency.Code, accountBalance.Balance, date);
                }
                // loans value
                var loans = await _context.Loans
                    .Include(l => l.Currency)
                    .Include(l => l.Payoffs)
                    .Where(l => l.UserId == user.Id)
                    .Where(l => l.LoanDate.Date <= date.Date)
                    .ToListAsync();

                foreach (var loan in loans)
                {
                    var currentAmount = loan.Payoffs
                        .Where(p => p.Date.Date <= date.Date)
                        .Sum(p => p.Amount);

                    var missingAmount = loan.FullAmount - currentAmount;

                    var convertedMissingAmount = await _utilities
                    .Convert(loan.Currency.Code, user.DefaultCurrency.Code, missingAmount);

                    if (loan.LoanType == LoanType.Credit)
                        value += convertedMissingAmount;
                    else if (loan.LoanType == LoanType.Debt)
                        value -= convertedMissingAmount;
                }

                chartObject.Data.Add(value);
                chartObject.Labels.Add(FormatDateTime(date, period));
            }

            // return data
            return Result<NetWorthValueOverTime>.Success(chartObject);
        }

        private static TimeWindow CalculateTimeWindow(ChartPeriod period, List<Asset> assets)
        {
            DateTime now = DateTime.UtcNow;

            DateTime startDate = period switch
            {
                ChartPeriod.YTD => new DateTime(now.Year, 1, 1),
                ChartPeriod.Month => now.AddDays(-30),
                ChartPeriod.Year => now.AddDays(-365),
                ChartPeriod.FiveYears => now.AddYears(-5),
                ChartPeriod.Max => FindEarliestDate(assets),
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };

            return new TimeWindow
            {
                StartDate = startDate,
                EndDate = now
            };
        }

        private static DateTime FindEarliestDate(List<Asset> assets)
        {
            if (assets == null || assets.Count == 0)
            {
                throw new ArgumentException("The assets list cannot be null or empty.");
            }

            DateTime earliestDate = assets
                .Where(asset => asset.AssetValues != null && asset.AssetValues.Count > 0)
                .SelectMany(asset => asset.AssetValues)
                .Min(av => av.Date);

            return earliestDate;
        }

        private static List<DateTime> CalculateDates(ChartPeriod period, TimeWindow timeWindow)
        {
            List<DateTime> dates = new List<DateTime>();
            DateTime currentDate = timeWindow.StartDate;

            switch (period)
            {
                case ChartPeriod.YTD:
                    while (currentDate <= timeWindow.EndDate)
                    {
                        dates.Add(new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month)));
                        currentDate = currentDate.AddMonths(1);
                    }
                    break;

                case ChartPeriod.Month:
                    for (int i = 0; i < 10; i++)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddDays(3);
                    }
                    break;

                case ChartPeriod.Year:
                    for (int i = 0; i < 12; i++)
                    {
                        dates.Add(new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month)));
                        currentDate = currentDate.AddMonths(1);
                    }
                    break;

                case ChartPeriod.FiveYears:
                    for (int i = 0; i < 12; i++)
                    {
                        dates.Add(new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month)));
                        currentDate = currentDate.AddMonths(5);
                    }
                    break;

                case ChartPeriod.Max:
                    int totalDays = (timeWindow.EndDate - timeWindow.StartDate).Days;
                    int interval = totalDays / 11; // 12 dates mean 11 intervals
                    for (int i = 0; i < 12; i++)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddDays(interval);
                    }
                    break;

                default:
                    throw new ArgumentOutOfRangeException(nameof(period), period, null);
            }

            if (dates.Last() != timeWindow.EndDate)
            {
                dates[^1] = timeWindow.EndDate;
            }

            return dates;
        }

        private static string FormatDateTime(DateTime dateTime, ChartPeriod period)
        {
            return period switch
            {
                ChartPeriod.Month => dateTime.ToString("dd/MM/yyyy"),
                ChartPeriod.YTD or ChartPeriod.Year or ChartPeriod.FiveYears or ChartPeriod.Max => dateTime.ToString("MM/yyyy"),
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };
        }
    }
}

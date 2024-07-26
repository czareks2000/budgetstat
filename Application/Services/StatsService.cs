using Application.Core;
using Application.Dto.Asset;
using Application.Dto.Stats;
using Application.Dto.Stats.Periods;
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

        public async Task<Result<ValueOverTime>> GetNetWorthValueOverTime(NetWorthChartPeriod period)
        {   
            var user = await _utilities.GetCurrentUserAsync();

            // filter assets by dates
            var assets = await _context.Assets
                .Include(a => a.AssetValues)
                    .ThenInclude(av => av.Currency)
                .Where(a => a.UserId == user.Id)
                .ToListAsync();

            // create result object
            ValueOverTime chartObject = new()
            {
                Data = [],
                Labels = [],
            };

            // calculate start and end dates
            var earliestDate = FindEarliestDate(assets);
            var timeWindow = CalculateTimeWindow(period, earliestDate);

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
                    .Where(l => l.LoanDate.Date <= date)
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
            return Result<ValueOverTime>.Success(chartObject);
        }

        public async Task<Result<decimal>> GetCurrentMonthIncome()
        {
            var user = await _utilities.GetCurrentUserAsync();

            //obliczyć na podstawie przychodów i wydatków w tym miesiącu
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Currency)
                .Where(t => t.UserId == user.Id)
                .Where(t => !t.Planned)
                .Where(t => t.Considered)
                .Where(t => t.Date.Year == DateTime.UtcNow.Year)
                .Where(t => t.Date.Month == DateTime.UtcNow.Month)
                .ToListAsync();

            decimal balance = 0;

            foreach (var transaction in transactions)
            {
                var category = transaction.Category;
                var currency = transaction.Currency;

                var convertedAmount = await _utilities
                    .Convert(currency.Code, user.DefaultCurrency.Code, transaction.Amount);

                if (category.Type == TransactionType.Income)
                    balance += convertedAmount;
                else if (category.Type == TransactionType.Expense)
                    balance -= convertedAmount;
            }

            return Result<decimal>.Success(balance);
        }

        public async Task<Result<ValueOverTime>> GetAccountBalanceValueOverTime(
            ChartPeriod period, List<int> accountIds, TimeWindow customWindow)
        {
            var user = await _utilities.GetCurrentUserAsync();

            var accounts = await _context.Accounts
                .Include(a => a.AccountBalances)
                    .ThenInclude(ab => ab.Currency)
                .Where(a => a.UserId == user.Id)
                .Where(a => a.Status == AccountStatus.Visible)
                .ToListAsync();

            // filter accounts
            if (accountIds.Count > 0) 
                accounts = accounts
                    .Where(a => accountIds.Contains(a.Id))
                    .ToList();

            // create result object
            ValueOverTime chartObject = new()
            {
                Data = [],
                Labels = [],
            };

            // calculate start and end dates
            var timeWindow = CalculateTimeWindow(period, customWindow);

            chartObject.StartDate = timeWindow.StartDate;
            chartObject.EndDate = timeWindow.EndDate;

            // calculate date labels
            var dates = CalculateDates(period, timeWindow);

            // calculate data
            foreach (var date in dates)
            {
                decimal value = 0;

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

                chartObject.Data.Add(value);
                chartObject.Labels.Add(FormatDateTime(date, period));
            }

            // return data
            return Result<ValueOverTime>.Success(chartObject);
        }

        #region HelperFunctions

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

        private static TimeWindow CalculateTimeWindow(NetWorthChartPeriod period, DateTime earilestDate)
        {
            DateTime now = DateTime.UtcNow;

            DateTime startDate = period switch
            {
                NetWorthChartPeriod.YTD => new DateTime(now.Year, 1, 1),
                NetWorthChartPeriod.Month => now.AddDays(-30),
                NetWorthChartPeriod.Year => now.AddDays(-365),
                NetWorthChartPeriod.FiveYears => now.AddYears(-5),
                NetWorthChartPeriod.Max => earilestDate,
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };

            return new TimeWindow
            {
                StartDate = startDate,
                EndDate = now
            };
        }

        private static TimeWindow CalculateTimeWindow(ChartPeriod period, TimeWindow window)
        {
            if (period == ChartPeriod.Custom)
                return window;

            DateTime now = DateTime.UtcNow;

            DateTime startDate = period switch
            {
                ChartPeriod.Last7Days => now.AddDays(-7),
                ChartPeriod.Last30Days => now.AddDays(-30),
                ChartPeriod.LastYear => now.AddDays(-365),
                ChartPeriod.Last5Years => now.AddYears(-5),
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

        private static DateTime FindEarliestDate(List<Account> accounts)
        {
            if (accounts == null || accounts.Count == 0)
            {
                throw new ArgumentException("The assets list cannot be null or empty.");
            }

            DateTime earliestDate = accounts
                .Where(account => account.AccountBalances != null && account.AccountBalances.Count > 0)
                .SelectMany(account => account.AccountBalances)
                .Min(ab => ab.Date);

            return earliestDate;
        }

        private static List<DateTime> CalculateDates(NetWorthChartPeriod period, TimeWindow timeWindow)
        {
            List<DateTime> dates = [];
            DateTime currentDate = timeWindow.StartDate;

            switch (period)
            {
                case NetWorthChartPeriod.YTD:
                    while (currentDate <= timeWindow.EndDate)
                    {
                        var date = new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month));
                        dates.Add(DateTime.SpecifyKind(date, DateTimeKind.Utc));
                        currentDate = currentDate.AddMonths(1);
                    }
                    break;

                case NetWorthChartPeriod.Month:
                    for (int i = 0; i < 10; i++)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddDays(3);
                    }
                    break;

                case NetWorthChartPeriod.Year:
                    for (int i = 0; i < 12; i++)
                    {
                        var date = new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month));
                        dates.Add(DateTime.SpecifyKind(date, DateTimeKind.Utc));
                        currentDate = currentDate.AddMonths(1);
                    }
                    break;

                case NetWorthChartPeriod.FiveYears:
                    for (int i = 0; i < 12; i++)
                    {
                        var date = new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month));
                        dates.Add(DateTime.SpecifyKind(date, DateTimeKind.Utc));
                        currentDate = currentDate.AddMonths(5);
                    }
                    break;

                case NetWorthChartPeriod.Max:
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

        private static List<DateTime> CalculateDates(ChartPeriod period, TimeWindow timeWindow)
        {
            List<DateTime> dates = [];
            DateTime currentDate = timeWindow.StartDate;

            switch (period)
            {
                case ChartPeriod.Last7Days:
                    for (int i = 0; i < 7; i++)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddDays(1);
                    }
                    break;

                case ChartPeriod.Last30Days:
                    for (int i = 0; i < 30; i++)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddDays(1);
                    }
                    break;

                case ChartPeriod.LastYear:
                    for (int i = 0; i < 12; i++)
                    {
                        var date = new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month));
                        dates.Add(DateTime.SpecifyKind(date, DateTimeKind.Utc));
                        currentDate = currentDate.AddMonths(1);
                    }
                    break;

                case ChartPeriod.Last5Years:
                    for (int i = 0; i < 12; i++)
                    {
                        var date = new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month));
                        dates.Add(DateTime.SpecifyKind(date, DateTimeKind.Utc));
                        currentDate = currentDate.AddMonths(5);
                    }
                    break;

                case ChartPeriod.Custom:
                    int totalDays = (timeWindow.EndDate - timeWindow.StartDate).Days;
                    int interval = totalDays / 29; // 30 dates mean 29 intervals
                    for (int i = 0; i < 30; i++)
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

        private static string FormatDateTime(DateTime dateTime, NetWorthChartPeriod period)
        {
            return period switch
            {
                NetWorthChartPeriod.Month => dateTime.ToString("dd/MM/yyyy"),
                NetWorthChartPeriod.YTD or NetWorthChartPeriod.Year or NetWorthChartPeriod.FiveYears or NetWorthChartPeriod.Max => dateTime.ToString("MM/yyyy"),
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };
        }

        private static string FormatDateTime(DateTime dateTime, ChartPeriod period)
        {
            return period switch
            {
                ChartPeriod.Custom => dateTime.ToString("dd/MM/yy"),
                ChartPeriod.Last7Days or ChartPeriod.Last30Days => dateTime.ToString("dd/MM"),
                ChartPeriod.LastYear or ChartPeriod.Last5Years => dateTime.ToString("MM/yyyy"),
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };
        }

        #endregion
    }
}

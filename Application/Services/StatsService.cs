using Application.Core;
using Application.Dto.Asset;
using Application.Dto.Stats;
using Application.Dto.Stats.Enums;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.AccessControl;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
            var earliestDate = FindEarliestDate(assets); // sprawdzanie nie tylko z assetów tylko też z accounts
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
                    .Convert(currency.Code, user.DefaultCurrency.Code, transaction.Amount, transaction.Date.Date);

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

        public async Task<Result<List<IncomesAndExpensesDataSetItem>>> GetIncomesAndExpensesOverTime(
            ExtendedChartPeriod period, List<int> accountIds, DateTime customDate,
            List<int> incomeCategoryIds, List<int> expenseCategoryIds)
        {
            var user = await _utilities.GetCurrentUserAsync();

            // transactions
            var transactions = await _context.Transactions
                .Include(a => a.Currency)
                .Include(a => a.Category)
                .Include(a => a.Account)
                .Where(a => a.UserId == user.Id)
                .Where(t => t.Considered)
                .Where(t => !t.Planned)
                .ToListAsync();

            // filter accounts
            if (accountIds.Count > 0)
                transactions = transactions
                    .Where(t => t.Account != null)
                    .Where(t => accountIds.Contains((int)t.AccountId))
                    .ToList();

            // create result object
            List<IncomesAndExpensesDataSetItem> dataSet = [];

            // calculate start and end dates
            var timeWindow = CalculateTimeWindow(period, customDate);

            // calculate date labels
            var dates = CalculateDates(period, timeWindow);

            // calculate data
            bool isEmpty = true;

            foreach (var date in dates)
            {
                IncomesAndExpensesDataSetItem dataSetItem = new()
                {
                    Income = 0,
                    Expense = 0,
                    Label = FormatDateTime(date, period)
                };

                // incomes value
                var incomes = await FilterTransactions(
                    transactions, TransactionType.Income, period, date, incomeCategoryIds, user.Id);

                foreach (var income in incomes)
                    dataSetItem.Income += await _utilities.Convert(income.Currency.Code, user.DefaultCurrency.Code, income.Amount, date.Date);

                // expenses value
                var expenses = await FilterTransactions(
                    transactions, TransactionType.Expense, period, date, expenseCategoryIds, user.Id);

                foreach (var expense in expenses)
                    dataSetItem.Expense += await _utilities.Convert(expense.Currency.Code, user.DefaultCurrency.Code, expense.Amount, date.Date);


                if (dataSetItem.Income != 0 || dataSetItem.Expense != 0)
                    isEmpty = false;

                dataSet.Add(dataSetItem);
            }

            // return data
            if (isEmpty)
                return Result<List<IncomesAndExpensesDataSetItem>>.Success([]);

            return Result<List<IncomesAndExpensesDataSetItem>>.Success(dataSet);
        }

        public async Task<Result<List<LabelValueItem>>> GetAvgMonthlyTransactionsValuesByCategories(
            TransactionType transactionType, AvgChartPeriod period, TimeWindow customWindow, 
            CategoryType categoryType, int mainCategoryId, List<int> accountIds)
        {
            var user = await _utilities.GetCurrentUserAsync();

            // transactions
            var transactionsQuery = _context.Transactions
                .Include(a => a.Currency)
                .Include(a => a.Category)
                    .ThenInclude(c => c.MainCategory)
                .Include(a => a.Account)
                .Where(a => a.UserId == user.Id)
                .Where(t => t.Considered)
                .Where(t => !t.Planned)
                .Where(t => t.Category.Type == transactionType);

            // filter accounts
            if (accountIds.Count > 0)
                transactionsQuery = transactionsQuery
                    .Where(t => t.Account != null)
                    .Where(t => accountIds.Contains((int)t.AccountId));
            
            // filter category type
            if (categoryType == CategoryType.Sub)
                transactionsQuery = transactionsQuery
                    .Where(t => t.Category.MainCategoryId == mainCategoryId);

            // calculate time window
            var timeWindow = CalculateTimeWindow(period, customWindow);

            // filter by dates
            transactionsQuery = transactionsQuery
                .Where(t => t.Date >= timeWindow.StartDate && t.Date <= timeWindow.EndDate);

            // fetch transactions
            var transactions = await transactionsQuery.ToListAsync();

            // create result object
            List<LabelValueItem> result = [];

            // calculate data
            var groupedTransactions = transactions
                .GroupBy(t => categoryType == CategoryType.Main ? t.Category.MainCategory : t.Category)
                .Select(group => new
                {
                    Category = group.Key,
                    Transactions = group.ToList()
                });

            foreach (var group in groupedTransactions)
            {
                var monthsInRange = (timeWindow.EndDate.Year - timeWindow.StartDate.Year) * 12 +
                                    timeWindow.EndDate.Month - timeWindow.StartDate.Month + 1;

                var totalAmount = group.Transactions
                    .Sum(t => _utilities.Convert(t.Currency.Code, user.DefaultCurrency.Code, t.Amount, t.Date).Result);

                var averageMonthlyValue = monthsInRange > 0 ? totalAmount / monthsInRange : 0;

                result.Add(new LabelValueItem
                {
                    Label = group.Category.Name,
                    Value = averageMonthlyValue
                });
            }

            return Result<List<LabelValueItem>>.Success(result);
        }

        #region HelperFunctions

        private async Task<List<Transaction>> FilterTransactions(
            List<Transaction> transactions, TransactionType type, ExtendedChartPeriod period, DateTime date, List<int> categoryIds, string userId)
        {
            var filteredTransactions = transactions
                    .Where(t => t.Category.Type == type);

            if (categoryIds.Count > 0)
            {
                var allCategoryIds = await _context.Categories
                    .Where(c => categoryIds.Contains(c.Id))
                    .Where(c => c.UserId == userId)
                    .Select(c => c.Id)
                    .ToListAsync();

                var subCategoriesOfMainCategories =  await _context.Categories
                    .Where(c => !c.IsMain)
                    .Where(c => categoryIds.Contains((int)c.MainCategoryId))
                    .Where(c => c.UserId == userId)
                    .Select(c => c.Id)
                    .ToListAsync();

                allCategoryIds.AddRange(subCategoriesOfMainCategories);

                filteredTransactions = filteredTransactions
                    .Where(t => allCategoryIds.Contains(t.CategoryId));
            }

            filteredTransactions = period switch
            {
                ExtendedChartPeriod.Last7Days or ExtendedChartPeriod.Last30Days or ExtendedChartPeriod.CustomMonth
                    => filteredTransactions.Where(i => i.Date.Date == date.Date),
                ExtendedChartPeriod.LastYear or ExtendedChartPeriod.CustomYear
                    => filteredTransactions.Where(i => i.Date.Month == date.Month && i.Date.Year == date.Year),
                ExtendedChartPeriod.Last5Years
                    => filteredTransactions.Where(i => i.Date.Year == date.Year),
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };

            return filteredTransactions.ToList();
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

        private static TimeWindow CalculateTimeWindow(ChartPeriod period, TimeWindow customWindow)
        {
            if (period == ChartPeriod.Custom)
                return customWindow;

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

        private static TimeWindow CalculateTimeWindow(ExtendedChartPeriod period, DateTime customDate)
        {
            if (period == ExtendedChartPeriod.CustomMonth)
            {
                var month = customDate.Month;
                var year = customDate.Year;

                var start = new DateTime(year, month, 1);
                start = DateTime.SpecifyKind(start, DateTimeKind.Utc);

                var end = start.AddMonths(1).AddDays(-1);
                end = DateTime.SpecifyKind(end, DateTimeKind.Utc);

                return new TimeWindow
                {
                    StartDate = start,
                    EndDate = end
                };
            }

            if (period == ExtendedChartPeriod.CustomYear)
            {
                var year = customDate.Year;

                var start = new DateTime(year, 1, 1);
                start = DateTime.SpecifyKind(start, DateTimeKind.Utc);

                var end = new DateTime(year, 12, 31);
                end = DateTime.SpecifyKind(end, DateTimeKind.Utc);

                return new TimeWindow
                {
                    StartDate = start,
                    EndDate = end
                };
            }

            DateTime now = DateTime.UtcNow;

            DateTime startDate = period switch
            {
                ExtendedChartPeriod.Last7Days => now.AddDays(-7),
                ExtendedChartPeriod.Last30Days => now.AddDays(-30),
                ExtendedChartPeriod.LastYear => now.AddDays(-365),
                ExtendedChartPeriod.Last5Years => now.AddYears(-5),
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };

            return new TimeWindow
            {
                StartDate = startDate,
                EndDate = now
            };
        }

        private static TimeWindow CalculateTimeWindow(AvgChartPeriod period, TimeWindow customWindow)
        {
            DateTime now = DateTime.UtcNow;

            var timeWindow = period switch
            {
                AvgChartPeriod.LastYear => new TimeWindow
                {
                    StartDate = new DateTime(now.AddDays(-365).Year, now.AddDays(-365).Month, 1, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month), 23, 59, 59, DateTimeKind.Utc)
                },
                AvgChartPeriod.Custom => new TimeWindow
                {
                    StartDate = new DateTime(customWindow.StartDate.Year, customWindow.StartDate.Month, 1, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(customWindow.EndDate.Year, customWindow.EndDate.Month, DateTime.DaysInMonth(customWindow.EndDate.Year, customWindow.EndDate.Month), 23, 59, 59, DateTimeKind.Utc)
                },
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };

            return timeWindow;
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

        private static List<DateTime> CalculateDates(ExtendedChartPeriod period, TimeWindow timeWindow)
        {
            List<DateTime> dates = [];
            DateTime currentDate = timeWindow.StartDate;

            switch (period)
            {
                case ExtendedChartPeriod.Last7Days:
                    for (int i = 0; i <= 7; i++)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddDays(1);
                    }
                    break;

                case ExtendedChartPeriod.Last30Days:
                    for (int i = 0; i <= 30; i++)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddDays(1);
                    }
                    break;

                case ExtendedChartPeriod.LastYear:
                    for (int i = 0; i <= 12; i++)
                    {
                        var date = new DateTime(currentDate.Year, currentDate.Month, DateTime.DaysInMonth(currentDate.Year, currentDate.Month));
                        dates.Add(DateTime.SpecifyKind(date, DateTimeKind.Utc));
                        currentDate = currentDate.AddMonths(1);
                    }
                    break;

                case ExtendedChartPeriod.Last5Years:
                    while (currentDate <= timeWindow.EndDate)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddYears(1);
                    }
                    break;

                case ExtendedChartPeriod.CustomMonth:
                    while (currentDate <= timeWindow.EndDate)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddDays(1);
                    }
                    break;

                case ExtendedChartPeriod.CustomYear:
                    while (currentDate <= timeWindow.EndDate)
                    {
                        dates.Add(currentDate);
                        currentDate = currentDate.AddMonths(1);
                    }
                    break;

                default:
                    throw new ArgumentOutOfRangeException(nameof(period), period, null);
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

        private static string FormatDateTime(DateTime dateTime, ExtendedChartPeriod period)
        {
            return period switch
            {
                ExtendedChartPeriod.CustomMonth => dateTime.ToString("dd/MM/yy"),
                ExtendedChartPeriod.Last7Days or ExtendedChartPeriod.Last30Days => dateTime.ToString("dd/MM"),
                ExtendedChartPeriod.LastYear or ExtendedChartPeriod.CustomYear => dateTime.ToString("MM/yyyy"),
                ExtendedChartPeriod.Last5Years => dateTime.ToString("yyyy"),
                _ => throw new ArgumentOutOfRangeException(nameof(period), period, null),
            };
        }

        #endregion
    }
}

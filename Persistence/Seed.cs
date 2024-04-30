using Domain;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<User> userManager)
        {
            if (userManager.Users.Any() || context.Accounts.Any())
                return;

            // currencies

            var currencies = new List<Currency>
            {
                new()
                {
                    Name = "U.S. dollar",
                    Code = "USD",
                    Symbol = "$",
                },
                new()
                {
                    Name = "Euro",
                    Code = "EUR",
                    Symbol = "€",
                },
                new()
                {
                    Name = "Polish złoty",
                    Code = "PLN",
                    Symbol = "zł",
                }
            };

            context.Currencies.AddRange(currencies);

            // users

            var users = new List<User>
            {
                new() 
                {
                    UserName = "bob",
                    DefaultCurrency = currencies[2],
                    Email = "bob@test.com"
                },
                new() 
                {
                    UserName = "tom",
                    DefaultCurrency = currencies[0],
                    Email = "tom@test.com"
                }
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }

            // accounts

            var accounts = new List<Account>
            {
                new()
                {
                    Name = "Bank",
                    AccountBalances = new List<AccountBalance>
                    {
                        new AccountBalance
                        {
                            Balance = 25000,
                            Currency = currencies[2]
                        }
                    },
                    Currency = currencies[2],
                    Description = "",
                    User = users[0],
                    CreatedAt = DateTime.UtcNow.AddMonths(-36),
                },
                new()
                {
                    Name = "Cash",
                    AccountBalances = new List<AccountBalance>
                    {
                        new AccountBalance
                        {
                            Balance = 10000,
                            Currency = currencies[2]
                        }
                    },
                    Currency = currencies[2],
                    Description = "",
                    User = users[0],
                    CreatedAt = DateTime.UtcNow.AddMonths(-36),
                }
            };

            context.Accounts.AddRange(accounts);

            // icons

            var icons = new List<Icon>
            {
                // expenses
                new() { Name = "home.png" },//0
                new() { Name = "food.png" },//1
                new() { Name = "recreation.png" },//2
                new() { Name = "transportation.png" },//3
                new() { Name = "travels.png" },//4
                new() { Name = "health.png" },//5
                new() { Name = "investment.png" },//6
                new() { Name = "financial.png" },//7
                new() { Name = "shopping.png" },//8
                new() { Name = "kids.png" }, //9 
                // incomes
                new() { Name = "earnings.png" },//10 
                // assets
                new() { Name = "property.png" },//11
                new() { Name = "movable_property.png" },//12
                // common
                new() { Name = "investment.png" },//13 
                new() { Name = "other.png" },//14
            };

            context.Icons.AddRange(icons);

            // categories for users[0]

            var expenseCategories = new List<Category>
            {
                new()
                {
                    Icon = icons[0],
                    Name = "Home",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[0], Name = "Rent", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Bills", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Furniture", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Appliances", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Decorations", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Insurance", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Renovation", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Repairs", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Other (Home)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new() 
                {
                    Icon = icons[1],
                    Name = "Food",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[1], Name = "Groceries", Type = TransactionType.Expense, User = users[0] }, // [1][0]
                        new() { Icon = icons[1], Name = "Eating out", Type = TransactionType.Expense, User = users[0] }, // [1][1]
                        new() { Icon = icons[1], Name = "Other (Food)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[2],
                    Name = "Recreation",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[2], Name = "Books", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[2], Name = "Cinemas, theaters, concerts", Type = TransactionType.Expense, User = users[0] }, //[2][1]
                        new() { Icon = icons[2], Name = "Cafe, bars", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[2], Name = "Sport, hobby", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[2], Name = "Subscriptions", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[2], Name = "Other (Recreation)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[3],
                    Name = "Transportation",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[3], Name = "Leasing", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[3], Name = "Maintenance", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[3], Name = "Insurance", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[3], Name = "Fuel", Type = TransactionType.Expense, User = users[0] }, // [3][3]
                        new() { Icon = icons[3], Name = "Fees", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[3], Name = "Public transport, taxi", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[3], Name = "Other (Transportation)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[4],
                    Name = "Travels",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[4], Name = "Accomodation", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[4], Name = "Transport", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[4], Name = "Food, beverages", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[4], Name = "Entertainment", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[4], Name = "Other (Travels)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[5],
                    Name = "Health",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[5], Name = "Medical Expenses", Type = TransactionType.Expense, User = users[0]},
                        new() { Icon = icons[5], Name = "Medications", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[5], Name = "Supplements", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[5], Name = "Dental Care", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[5], Name = "Therapy & Counseling", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[5], Name = "Wellness, beauty", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[5], Name = "Health insurance", Type = TransactionType.Expense, User = users[0]},
                        new() { Icon = icons[5], Name = "Other (Health)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[6],
                    Name = "Investment",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[6], Name = "ETF index funds", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[6], Name = "Shares", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[6], Name = "Bonds", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[6], Name = "Mutual funds", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[6], Name = "Business", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[6], Name = "Other (Investment)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[7],
                    Name = "Financial",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[7], Name = "Taxes", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[7], Name = "Fees", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[7], Name = "Gifts", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[7], Name = "Charity", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[7], Name = "Other (Financial)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[8],
                    Name = "Shopping",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[8], Name = "Clothing", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[8], Name = "Electronics", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[8], Name = "Education", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[8], Name = "Pets", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[8], Name = "Other (Shopping)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[9],
                    Name = "Kids",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[9], Name = "Clothing", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[9], Name = "Education", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[9], Name = "Activities", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[9], Name = "Pocketmoney", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[9], Name = "Toys", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[9], Name = "Healthcare", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[9], Name = "Childcare", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[9], Name = "Other (Kids)", Type = TransactionType.Expense, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[14],
                    Name = "Other",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[14], Name = "No category", Type = TransactionType.Expense, User = users[0] }
                    }
                }
            };

            context.Categories.AddRange(expenseCategories);

            var incomeCategories = new List<Category>
            {
                new()
                {
                    Icon = icons[10],
                    Name = "Earnings",
                    Type = TransactionType.Income,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[10], Name = "Salary", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[10], Name = "Pension", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[10], Name = "Odd jobs", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[10], Name = "Scholarship", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[10], Name = "Business Profit", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[10], Name = "Other (Earnings)", Type = TransactionType.Income, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[13],
                    Name = "Investment",
                    Type = TransactionType.Income,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[13], Name = "Interest", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[13], Name = "Dividends", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[13], Name = "Other (Investment)", Type = TransactionType.Income, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[14],
                    Name = "Other",
                    Type = TransactionType.Income,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[14], Name = "Gifts", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[14], Name = "No category", Type = TransactionType.Income, User = users[0] }
                    }
                }
            };

            context.Categories.AddRange(incomeCategories);

            // asset categories

            var assetCategories = new List<AssetCategory>()
{
                new() { Name = "Investments", Icon = icons[13] },
                new() { Name = "Property", Icon = icons[11] },
                new() { Name = "Movable property", Icon = icons[12] },
                new() { Name = "Other", Icon = icons[14] }
            };

            context.AssetCategories.AddRange(assetCategories);

            // transactions

            var transactions = new List<Transaction>()
            {
                // Transactions for accounts[0]
                new Transaction
                {
                    Id = 1,
                    Amount = 100.50m,
                    Date = DateTime.UtcNow.AddDays(-10),
                    Description = "Supermarket",
                    Considered = true,
                    Planned = false,
                    Account = accounts[0],
                    Category = expenseCategories[1].SubCategories.ToList()[0],
                    Currency = currencies[2]
                },
                new Transaction
                {
                    Id = 2,
                    Amount = 50.00m,
                    Date = DateTime.UtcNow.AddDays(-8),
                    Description = "Gas station",
                    Considered = true,
                    Planned = false,
                    Account = accounts[0],
                    Category = expenseCategories[3].SubCategories.ToList()[3],
                    Currency = currencies[2]
                },

                // Transactions for accounts[1]
                new Transaction
                {
                    Id = 3,
                    Amount = 200.00m,
                    Date = DateTime.UtcNow.AddDays(-8),
                    Description = "Dinner with friends",
                    Considered = true,
                    Planned = false,
                    Account = accounts[1],
                    Category = expenseCategories[1].SubCategories.ToList()[1],
                    Currency = currencies[2]
                },
                new Transaction
                {
                    Id = 4,
                    Amount = 80.00m,
                    Date = DateTime.UtcNow.AddDays(-5),
                    Description = "Movie tickets",
                    Considered = true,
                    Planned = false,
                    Account = accounts[1],
                    Category = expenseCategories[2].SubCategories.ToList()[1],
                    Currency = currencies[2]
                }
            };

            context.Transactions.AddRange(transactions);

            // transfers

            var transfers = new List<Transfer>()
            {
                new Transfer
                {
                    Amount = 200.00m,
                    Date = DateTime.UtcNow,
                    FromAccount = accounts[0],
                    ToAccount = accounts[1],
                    Currency = currencies[2]
                }
            };

            context.Transfers.AddRange(transfers);

            // budgets

            var budgets = new List<Budget>()
            {
                new Budget
                {
                    Name = "Groceries",
                    Period = BudgetPeriod.Week,
                    Currency = currencies[2],
                    Amount = 200.00m,
                    User = users[0]
                },
                new Budget
                {
                    Name = "Entertainment",
                    Period = BudgetPeriod.Month,
                    Currency = currencies[2],
                    Amount = 300.00m,
                    User = users[0]
                },
                new Budget
                {
                    Name = "Travel",
                    Period = BudgetPeriod.Year,
                    Currency = currencies[2],
                    Amount = 2000.00m,
                    User = users[0]
                }
            };

            context.Budgets.AddRange(budgets);

            // budget categories

            var budgetcategories = new List<BudgetCategory>
            {
                new BudgetCategory
                {
                    Category = expenseCategories[1].SubCategories.ToList()[0],
                    Budget = budgets[0]
                },
                new BudgetCategory
                {
                    Category = expenseCategories[2],
                    Budget = budgets[1]
                },
                new BudgetCategory
                {
                    Category = expenseCategories[4],
                    Budget = budgets[2]
                }
            };

            context.BudgetCategories.AddRange(budgetcategories);

            // loans

            var loans = new List<Loan>
            {
                new Loan
                {
                    LoanType = LoanType.Credit,
                    Account = accounts[0],
                    CurrentAmount = 5000.00m,
                    FullAmount = 10000.00m,
                    Counterparty = new Counterparty { Name = "John", User = users[0] },
                    LoanDate = DateTime.UtcNow.AddDays(-5),
                    RepaymentDate = DateTime.UtcNow.AddMonths(5),
                    Description = "Credit for home renovation",
                    User = users[0],
                    LoanStatus = LoanStatus.InProgress, 
                    Payoffs = new List<Payoff>()
                    {
                        new Payoff() { Amount = 2500.00m, Account = accounts[0], Date = DateTime.UtcNow.AddDays(-3) },
                        new Payoff() { Amount = 2500.00m, Account = accounts[0], Date = DateTime.UtcNow }
                    }
                },
                new Loan
                {
                    LoanType = LoanType.Debt,
                    Account = accounts[0],
                    CurrentAmount = 1000.00m,
                    FullAmount = 5000.00m, 
                    Counterparty = new Counterparty { Name = "Frank", User = users[0] },
                    LoanDate = DateTime.UtcNow.AddDays(-10),
                    RepaymentDate = DateTime.UtcNow.AddMonths(5),
                    Description = "Car",
                    User = users[0], 
                    LoanStatus = LoanStatus.InProgress,
                    Payoffs = new List<Payoff>()
                    {
                        new Payoff() { Amount = 1000.00m, Account = accounts[0], Date = DateTime.UtcNow, Description = "First installment" },
                    }
                }
            };

            context.Loans.AddRange(loans);

            // assets

            var assets = new List<Asset>()
            {
                new Asset 
                { 
                    Name = "Apartment", 
                    AssetValues = new List<AssetValue>{ 
                        new AssetValue
                        {
                            Value = 500000.00m , 
                            Currency = currencies[2]
                        }
                    }, 
                    Date = DateTime.UtcNow.AddMonths(-2), 
                    User = users[0], 
                    AssetCategory = assetCategories[1],
                    Currency = currencies[2]
                },
                new Asset 
                { 
                    Name = "Car", 
                    AssetValues =  new List<AssetValue>{
                        new AssetValue
                        {
                            Value = 35000.00m ,
                            Currency = currencies[2]
                        }
                    }, 
                    Date = DateTime.UtcNow.AddMonths(-24), 
                    User = users[0], 
                    AssetCategory = assetCategories[2],
                    Currency = currencies[2]
                }
            };

            context.Assets.AddRange(assets);

            await context.SaveChangesAsync();
        }
    }
}

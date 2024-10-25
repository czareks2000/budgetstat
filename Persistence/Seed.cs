﻿using Domain;
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
                    Name = "Polish złoty",
                    Code = "PLN",
                    Symbol = "zł",
                },
                new()
                {
                    Name = "Euro",
                    Code = "EUR",
                    Symbol = "€",
                },
                new()
                {
                    Name = "U.S. dollar",
                    Code = "USD",
                    Symbol = "$",
                },
                new()
                {
                    Name = "Sterling",
                    Code = "GBP",
                    Symbol = "£",
                },
                new()
                {
                    Name = "Czech koruna",
                    Code = "CZK",
                    Symbol = "Kč",
                },
                new()
                {
                    Name = "Swiss franc",
                    Code = "CHF",
                    Symbol = "Fr",
                },
                new()
                {
                    Name = "Swedish krona",
                    Code = "SEK",
                    Symbol = "kr",
                },
                new()
                {
                    Name = "Canadian Dollar",
                    Code = "CAD",
                    Symbol = "C$",
                },
                new()
                {
                    Name = "Japanese yen",
                    Code = "JPY",
                    Symbol = "¥",
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
                new() { Name = "Home" },//0
                new() { Name = "Restaurant" },//1
                new() { Name = "SelfImprovement" },//2
                new() { Name = "Commute" },//3
                new() { Name = "Flight" },//4
                new() { Name = "MedicalServices" },//5
                new() { Name = "ShowChart" },//6
                new() { Name = "AccountBalance" },//7
                new() { Name = "ShoppingCart" },//8
                new() { Name = "ChildFriendly" }, //9 
                // incomes
                new() { Name = "Paid" },//10 
                // assets
                new() { Name = "MapsHomeWork" },//11
                new() { Name = "DirectionsCar" },//12
                // other
                new() { Name = "Chair" },//13
                new() { Name = "Help" },//14
                // transfer
                new() { Name = "SwapHoriz" },//15

                // for subcategories
                new() { Name = "Kitchen" }, //16
                new() { Name = "FormatPaint" }, //17
                new() { Name = "Handyman" }, //18
                new() { Name = "LocalFlorist" }, //19

                new() { Name = "MenuBook" }, //20
                new() { Name = "Event" }, //21
                new() { Name = "Coffee" }, //22
                new() { Name = "FitnessCenter" }, //23
                new() { Name = "EventRepeat" }, //24

                new() { Name = "CurrencyExchange" }, //25
                new() { Name = "Build" }, //26
                new() { Name = "SafetyCheck" }, //27
                new() { Name = "LocalGasStation" }, //28
                new() { Name = "Payments" }, //29

                new() { Name = "Apartment" }, //30
                new() { Name = "Sailing" }, //31

                new() { Name = "Medication" }, //32
                new() { Name = "Psychology" }, //33
                new() { Name = "Spa" }, //34
                new() { Name = "MedicalInformation" }, //35

                new() { Name = "Business" }, //36

                new() { Name = "Redeem" }, //37
                new() { Name = "AttachMoney" }, //38
                new() { Name = "VolunteerActivism" }, //39

                new() { Name = "Checkroom" }, //40
                new() { Name = "Cable" }, //41
                new() { Name = "School" }, //42
                new() { Name = "Pets" }, //43

                new() { Name = "DirectionsRun" }, //44
                new() { Name = "Toys" }, //45

                new() { Name = "Work" }, //46
                new() { Name = "ElderlyWoman" }, //47
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
                        new() { Icon = icons[29], Name = "Rent", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[29], Name = "Bills", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[13], Name = "Furniture", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[16], Name = "Appliances", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[19], Name = "Decorations", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[0], Name = "Insurance", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[17], Name = "Renovation", Type = TransactionType.Expense, User = users[0] },
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
                        new() { Icon = icons[8], Name = "Groceries", Type = TransactionType.Expense, User = users[0] }, // [1][0]
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
                        new() { Icon = icons[20], Name = "Books", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[21], Name = "Events", Type = TransactionType.Expense, User = users[0] }, //[2][1]
                        new() { Icon = icons[22], Name = "Cafe, bars", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[23], Name = "Sport, hobby", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[24], Name = "Subscriptions", Type = TransactionType.Expense, User = users[0] },
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
                        new() { Icon = icons[25], Name = "Leasing", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[26], Name = "Maintenance", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[27], Name = "Insurance", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[28], Name = "Fuel", Type = TransactionType.Expense, User = users[0] }, // [3][3]
                        new() { Icon = icons[29], Name = "Fees", Type = TransactionType.Expense, User = users[0] },
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
                        new() { Icon = icons[30], Name = "Accomodation", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[4], Name = "Transport", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[1], Name = "Food, beverages", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[31], Name = "Entertainment", Type = TransactionType.Expense, User = users[0] },
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
                        new() { Icon = icons[32], Name = "Medications", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[32], Name = "Supplements", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[5], Name = "Dental Care", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[33], Name = "Therapy & Counseling", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[34], Name = "Wellness, beauty", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[35], Name = "Health insurance", Type = TransactionType.Expense, User = users[0]},
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
                        new() { Icon = icons[7], Name = "Bonds", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[7], Name = "Mutual funds", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[36], Name = "Business", Type = TransactionType.Expense, User = users[0] },
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
                        new() { Icon = icons[38], Name = "Fees", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[37], Name = "Gifts", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[39], Name = "Charity", Type = TransactionType.Expense, User = users[0] },
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
                        new() { Icon = icons[40], Name = "Clothing", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[41], Name = "Electronics", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[42], Name = "Education", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[43], Name = "Pets", Type = TransactionType.Expense, User = users[0] },
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
                        new() { Icon = icons[40], Name = "Clothing", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[42], Name = "Education", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[44], Name = "Activities", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[29], Name = "Pocketmoney", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[45], Name = "Toys", Type = TransactionType.Expense, User = users[0] },
                        new() { Icon = icons[5], Name = "Healthcare", Type = TransactionType.Expense, User = users[0] },
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
                        new() { Icon = icons[46], Name = "Salary", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[47], Name = "Pension", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[46], Name = "Odd jobs", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[42], Name = "Scholarship", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[36], Name = "Business Profit", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[10], Name = "Other (Earnings)", Type = TransactionType.Income, User = users[0] }
                    }
                },
                new()
                {
                    Icon = icons[6],
                    Name = "Investment",
                    Type = TransactionType.Income,
                    IsMain = true,
                    User = users[0],
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons[6], Name = "Interest", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[6], Name = "Dividends", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[6], Name = "Other (Investment)", Type = TransactionType.Income, User = users[0] }
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
                        new() { Icon = icons[37], Name = "Gifts", Type = TransactionType.Income, User = users[0] },
                        new() { Icon = icons[14], Name = "No category", Type = TransactionType.Income, User = users[0] }
                    }
                }
            };

            context.Categories.AddRange(incomeCategories);

            // asset categories

            var assetCategories = new List<AssetCategory>()
{
                new() { Name = "Investments", Icon = icons[6] },
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
                    Amount = 100.50m,
                    Date = DateTime.UtcNow.AddDays(-10),
                    Description = "Supermarket",
                    Considered = true,
                    Planned = false,
                    Account = accounts[0],
                    Category = expenseCategories[1].SubCategories.ToList()[0],
                    Currency = currencies[2],
                    User = users[0],
                },
                new Transaction
                {
                    Amount = 50.00m,
                    Date = DateTime.UtcNow.AddDays(-8),
                    Description = "Gas station",
                    Considered = true,
                    Planned = false,
                    Account = accounts[0],
                    Category = expenseCategories[3].SubCategories.ToList()[3],
                    Currency = currencies[2],
                    User = users[0],
                },

                // Transactions for accounts[1]
                new Transaction
                {
                    Amount = 200.00m,
                    Date = DateTime.UtcNow.AddDays(-8),
                    Description = "Dinner with friends",
                    Considered = true,
                    Planned = false,
                    Account = accounts[1],
                    Category = expenseCategories[1].SubCategories.ToList()[1],
                    Currency = currencies[2],
                    User = users[0],
                },
                new Transaction
                {
                    Amount = 80.00m,
                    Date = DateTime.UtcNow.AddDays(-5),
                    Description = "Movie tickets",
                    Considered = true,
                    Planned = false,
                    Account = accounts[1],
                    Category = expenseCategories[2].SubCategories.ToList()[1],
                    Currency = currencies[2],
                    User = users[0],
                }
            };

            context.Transactions.AddRange(transactions);

            // transfers

            var transfers = new List<Transfer>()
            {
                new Transfer
                {
                    FromAmount = 200.00m,
                    ToAmount = 200.00m,
                    Date = DateTime.UtcNow,
                    FromAccount = accounts[0],
                    ToAccount = accounts[1]
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
                    Currency = currencies[2],
                    Payoffs = new List<Payoff>()
                    {
                        new Payoff() { Amount = 2500.00m, Account = accounts[0], Date = DateTime.UtcNow.AddDays(-3), Currency = currencies[2] },
                        new Payoff() { Amount = 2500.00m, Account = accounts[0], Date = DateTime.UtcNow, Currency = currencies[2] },
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
                    Currency = currencies[2],
                    Payoffs = new List<Payoff>()
                    {
                        new Payoff() { Amount = 1000.00m, Account = accounts[0], Date = DateTime.UtcNow, Description = "First installment", Currency = currencies[2] }
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
                            Currency = currencies[2],
                            Date = DateTime.UtcNow.AddMonths(-2),
                        }
                    }, 
                    
                    User = users[0], 
                    AssetCategory = assetCategories[1]
                },
                new Asset 
                { 
                    Name = "Car", 
                    AssetValues =  new List<AssetValue>{
                        new AssetValue
                        {
                            Value = 35000.00m ,
                            Currency = currencies[2],
                            Date = DateTime.UtcNow.AddMonths(-24),
                        }
                    }, 
                    User = users[0], 
                    AssetCategory = assetCategories[2]
                }
            };

            context.Assets.AddRange(assets);

            await context.SaveChangesAsync();
        }
    }
}

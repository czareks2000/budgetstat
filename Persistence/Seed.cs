using Domain;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                    Balance = 25000,
                    Currency = currencies[2],
                    Description = "",
                    User = users[0]
                },
                new()
                {
                    Name = "Cash",
                    Balance = 10000,
                    Currency = currencies[2],
                    Description = "",
                    User = users[0]
                },

            };

            context.Accounts.AddRange(accounts);

            // categories

            var categories = new List<Category>
            {
                new()
                {
                    Icon = "icon.png",
                    Name = "Food",
                    Type = TransactionType.Expense,
                    IsMain = true,
                    Categories = new List<Category>
                    {

                    }
                }
            };

            await context.SaveChangesAsync();
        }
    }
}

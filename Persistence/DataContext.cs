﻿using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Icon> Icons { get; set; }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<AccountBalance> AccountBalances { get; set; }

        public DbSet<Budget> Budgets { get; set; }
        public DbSet<BudgetCategory> BudgetCategories { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Counterparty> Counterparties { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<Payoff> Payoffs { get; set; }

        public DbSet<Asset> Assets { get; set; }
        public DbSet<AssetCategory> AssetCategories { get; set; }
        public DbSet<AssetValue> AssetValues { get; set; }

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Transfer> Transfers { get; set; }

        public DbSet<ExchangeRate> ExchangeRates { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //relations

            builder.Entity<BudgetCategory>(x => x.HasKey(bc => new { bc.BudgetId, bc.CategoryId }));

            builder.Entity<BudgetCategory>()
                .HasOne(bc => bc.Budget)
                .WithMany(b => b.Categories)
                .HasForeignKey(bc => bc.BudgetId);

            builder.Entity<BudgetCategory>()
                .HasOne(bc => bc.Category)
                .WithMany(b => b.Budgets)
                .HasForeignKey(bc => bc.CategoryId);

            builder.Entity<Transfer>()
                .HasOne(t => t.FromAccount)
                .WithMany(a => a.Sources)
                .HasForeignKey(t => t.FromAccountId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Transfer>()
                .HasOne(t => t.ToAccount)
                .WithMany(a => a.Destinations)
                .HasForeignKey(t => t.ToAccountId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.UserId);

            builder.Entity<AccountBalance>()
                .HasOne(ab => ab.Currency)
                .WithMany(c => c.AccountBalances)
                .HasForeignKey(ab => ab.CurrencyId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Payoff>()
               .HasOne(p => p.Loan)
               .WithMany(l => l.Payoffs)
               .HasForeignKey(ab => ab.LoanId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Loan>()
               .HasMany(l => l.Payoffs)
               .WithOne(p => p.Loan)
               .HasForeignKey(p => p.LoanId)
               .OnDelete(DeleteBehavior.NoAction);

            // Zapobieganie kaskadowemu usuwaniu
            builder.Entity<Account>()
                .HasMany(a => a.Transactions)
                .WithOne(t => t.Account)
                .OnDelete(DeleteBehavior.ClientSetNull);

            builder.Entity<Account>()
                .HasMany(a => a.Loans)
                .WithOne(t => t.Account)
                .OnDelete(DeleteBehavior.ClientSetNull);

            builder.Entity<Account>()
                .HasMany(a => a.Payoffs)
                .WithOne(t => t.Account)
                .OnDelete(DeleteBehavior.ClientSetNull);

            //default values

            builder.Entity<Transaction>()
                .Property(t => t.Considered)
                .HasDefaultValue(true);

            builder.Entity<Transaction>()
                .Property(t => t.Planned)
                .HasDefaultValue(false);

            builder.Entity<Loan>()
               .Property(l => l.CurrentAmount)
               .HasDefaultValue(0);

            // Unique constraint for ExchangeRate
            builder.Entity<ExchangeRate>()
                .HasIndex(er => new { er.InputCurrencyCode, er.OutputCurrencyCode, er.Date })
                .IsUnique();
        }
    }
}

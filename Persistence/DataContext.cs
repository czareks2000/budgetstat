using Domain;
using Domain.Enums;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;


namespace Persistence
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<BudgetCategory> BudgetCategories { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Counterparty> Counterparties { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<Payoff> Payoffs { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<AssetCategory> AssetCategories { get; set; }
        public DbSet<Transaction>  Transactions { get; set; }
        public DbSet<Transfer> Transfers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //relations

            builder.Entity<BudgetCategory>(x => x.HasKey(bc => new { bc.BudgetId, bc.CategoryId }));

            builder.Entity<BudgetCategory>()
                .HasOne(bc => bc.Budget)
                .WithMany(b => b.BudgetCategories)
                .HasForeignKey(bc => bc.BudgetId);

            builder.Entity<BudgetCategory>()
                .HasOne(bc => bc.Category)
                .WithMany(b => b.Budgets)
                .HasForeignKey(bc => bc.BudgetId);

            builder.Entity<Transfer>()
                .HasOne(t => t.FromAccount)
                .WithMany(a => a.Sources)
                .HasForeignKey(t => t.FromAccountId);

            builder.Entity<Transfer>()
                .HasOne(t => t.ToAccount)
                .WithMany(a => a.Destinations)
                .HasForeignKey(t => t.ToAccountId);

            //default values

            builder.Entity<Account>()
                .Property(a => a.Status)
                .HasDefaultValue(AccountStatus.Visible)
                .HasSentinel(default);

            builder.Entity<Transaction>()
                .Property(t => t.Considered)
                .HasDefaultValue(true);

            builder.Entity<Transaction>()
                .Property(t => t.Planned)
                .HasDefaultValue(false);

            builder.Entity<Budget>()
                .Property(b => b.Period)
                .HasDefaultValue(BudgetPeriod.Month)
                .HasSentinel(default);

            builder.Entity<Loan>()
               .Property(l => l.CurrentAmount)
               .HasDefaultValue(0);

            builder.Entity<Loan>()
               .Property(l => l.LoanStatus)
               .HasDefaultValue(LoanStatus.InProgress)
               .HasSentinel(default);

        }
    }
}

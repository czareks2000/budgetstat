using Application.Core;
using Application.Dto.Budget;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class BudgetService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : IBudgetService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<int>> Create(BudgetCreateDto newBudget)
        {
            var user = await _utilities.GetCurrentUserAsync();

            if (user == null) return Result<int>.Failure("User not found");

            // sprawdzenie czy podane kategorie są poprawne
            var categories = ValidateCategories(newBudget.CategoryIds);

            if (categories == null)
                return Result<int>.Failure("Invalid categories");

            var budget = _mapper.Map<Budget>(newBudget);

            budget.Categories = CreateBudgetCategoryList(categories);
            budget.Currency = user.DefaultCurrency;
            budget.User = user;

            _context.Budgets.Add(budget);

            if (await _context.SaveChangesAsync() == 0)
                return Result<int>.Failure("Failed to create budget");

            return Result<int>.Success(budget.Id);
        }

        public async Task<Result<object>> Delete(int budgetId)
        {
            var budget = await _context.Budgets.FindAsync(budgetId);

            if (budget == null) return null;

            _context.Budgets.Remove(budget);

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete budget");

            return Result<object>.Success(null);
        }

        public async Task<Result<List<BudgetDto>>> GetAll()
        {
            var user = await _utilities.GetCurrentUserAsync();

            if (user == null) return Result<List<BudgetDto>>.Failure("User not found");

            var budgetsDto = await _context.Budgets
                .Include(b => b.Currency)
                .Include(b => b.Categories)
                    .ThenInclude(c => c.Category)
                        .ThenInclude(c => c.Icon)
                .Where(b => b.User == user)
                .ProjectTo<BudgetDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            foreach (var budget in budgetsDto)
            {
                budget.ConvertedAmount = _utilities
                    .ConvertToDefaultCurrency(user, budget.Currency.Code, budget.Amount);
                
                var categoryIds = budget.Categories.Select(c => c.Id).ToList();

                budget.CurrentAmount = await CurrentAmount(user, categoryIds, budget.Period);
            }
                
            return Result<List<BudgetDto>>.Success(budgetsDto);
        }

        public async Task<Result<BudgetDto>> Update(int budgetId, BudgetUpdateDto updatedBudget)
        {
            var budget = await _context.Budgets
                .Include(b => b.Categories)
                .FirstOrDefaultAsync(b => b.Id == budgetId);

            if (budget == null) return null;

            // aktualizacja zwyłych pól
            updatedBudget.Name ??= budget.Name;
            updatedBudget.Period ??= budget.Period;
            updatedBudget.Amount ??= budget.Amount;

            _mapper.Map(updatedBudget, budget);

            // aktualizacja kategorii
            var newCategoryIds = updatedBudget.CategoryIds;

            if (newCategoryIds != null)
            {
                var categories = ValidateCategories(newCategoryIds);

                if (categories == null)
                    return Result<BudgetDto>.Failure("Invalid categories");

                budget.Categories = CreateBudgetCategoryList(categories);
            }

            // wprowadzanie zmian 
            _context.Budgets.Update(budget);

            // zatwierdzenie zmian
            if (await _context.SaveChangesAsync() == 0)
                return Result<BudgetDto>.Failure("Failed to update budget");

            budget = await _context.Budgets
                .Include(b => b.Currency)
                .Include(b => b.Categories)
                    .ThenInclude(c => c.Category)
                        .ThenInclude(c => c.Icon)
                .FirstOrDefaultAsync(b => b.Id == budgetId);

            var budgetDto = _mapper.Map<BudgetDto>(budget);
            var categoryIds = budgetDto.Categories.Select(c => c.Id).ToList();

            var user = await _utilities.GetCurrentUserAsync();

            budgetDto.ConvertedAmount = _utilities
                    .ConvertToDefaultCurrency(user, budget.Currency.Code, budget.Amount);

            budgetDto.CurrentAmount = await CurrentAmount(user, categoryIds, budget.Period);

            return Result<BudgetDto>.Success(budgetDto);
        }

        // sprawdzenie czy podane kategorie istnieją
        private bool CategoriesExist(List<int> categoryIds)
        {
            return categoryIds.All(id => _context.Categories.Any(c => c.Id == id));
        }

        // sprawdzenie czy kategorie mają typ expense
        private bool IsExpenseCategories(List<int> categoryIds)
        {
            var categoriesQuery = _context.Categories
                .Where(c => categoryIds.Contains(c.Id));

            //sprawdzenie czy kategorie mają typ expense
            foreach (var category in categoriesQuery)
                if (category.Type != TransactionType.Expense)
                    return false;

            return true;
        }

        // usuwa kategorie podrzędne, jeżeli podana została ich kategoria nadrzędna
        // zwraca zminimalizowaną liste kategorii
        private List<Category> RemoveExcessCategories(List<int> categoryIds)
        {
            var categoriesQuery = _context.Categories
                .Where(c => categoryIds.Contains(c.Id));

            var mainCategories = categoriesQuery.Where(c => c.IsMain).ToList();
            var subCategories = categoriesQuery.Where(c => !c.IsMain).ToList();

            for (int i = subCategories.Count - 1; i >= 0; i--)
            {
                var category = subCategories[i];
                if (mainCategories.FirstOrDefault(c => c.Id == category.MainCategoryId) != null)
                {
                    subCategories.RemoveAt(i);
                }
            }

            return mainCategories.Concat(subCategories).ToList();
        }

        // sprawdza czy podane kategorie są prawidłowe i zwraca listę obiektów tych kategorii
        private List<Category> ValidateCategories(List<int> categoryIds)
        {
            //sprawdzenie czy podane kategorie istnieją
            if (!CategoriesExist(categoryIds))
                return null;

            //sprawdzenie czy kategorie mają typ expense
            if (!IsExpenseCategories(categoryIds))
                return null;

            //usuwamy kategorie podrzędne, jeżeli podana została ich kategoria nadrzędna
            return RemoveExcessCategories(categoryIds);
        }

        // zwraca listę typu List<BudgetCategory> na podstawie listy typu List<Category>
        private static List<BudgetCategory> CreateBudgetCategoryList(List<Category> categories)
        {
            var budgetCategories = new List<BudgetCategory>();

            foreach (var category in categories)
                budgetCategories.Add(new BudgetCategory
                {
                    Category = category
                });

            return budgetCategories;
        }

        // funkcja zwarająca łączną wartość wydatków na dane kategorie w domyślniej walucie w danym okresie
        private async Task<decimal> CurrentAmount(User user, List<int> categoryIds, BudgetPeriod period)
        {
            DateTime now = DateTime.UtcNow;
            DateTime startDate;

            switch (period)
            {
                case BudgetPeriod.Week:
                    // od ostatniego poniedziałku
                    int daysToMonday = ((int)DayOfWeek.Monday - (int)now.DayOfWeek + 7) % 7;
                    startDate = DateTime.UtcNow.Date.AddDays(-daysToMonday);
                    break;
                case BudgetPeriod.Month:
                    // od początku aktualnego miesiąca
                    startDate = DateTime.SpecifyKind(new DateTime(now.Year, now.Month, 1), DateTimeKind.Utc);
                    break;
                case BudgetPeriod.Year:
                    // od początku aktualnego roku
                    startDate = DateTime.SpecifyKind(new DateTime(now.Year, 1, 1), DateTimeKind.Utc);
                    break;
                default:
                    throw new ArgumentException("Invalid BudgetPeriod value", nameof(period));
            }

            // sprawdzenie czy kategoria jest głowną,
            // jak tak to zamiast niej pobranie wszystkich jej podkategorii z bazy
            var categoriesQuery = _context.Categories
                .Where(c => categoryIds.Contains(c.Id));

            var mainCategoriesIds = categoriesQuery.Where(c => c.IsMain).Select(c => c.Id).ToList();
            var subCategories = categoriesQuery.Where(c => !c.IsMain).ToList();

            subCategories =
            [
                .. subCategories,
                .. _context.Categories
                        .Where(c => !c.IsMain)
                        .Where(c => mainCategoriesIds.Contains((int)c.MainCategoryId))
            ];

            // pobranie Transactions typu expense z danego okresu danego użytkownika o danych kategoriach
            var transactions = await _context.Transactions
                .Where(t => t.Considered)
                .Where(t => !t.Planned)
                .Where(t => t.Account.UserId == user.Id)
                .Where(t => t.Category.Type == TransactionType.Expense)
                .Where(t => subCategories.Contains(t.Category))
                .Where(t => t.Date >= startDate && t.Date <= now)
                .ToListAsync();

            // obliczenie current amount an podstawie wartości transakcji, uwzględniając konwersje waluty
            decimal currentAmount = 0;

            foreach (var t in transactions )
                currentAmount += _utilities.ConvertToDefaultCurrency(user, t.Currency.Code, t.Amount);

            return currentAmount;
        }
    }
}

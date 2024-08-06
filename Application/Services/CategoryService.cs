using Application.Core;
using Application.Dto.Category;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class CategoryService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : ICategoryService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<List<MainCategoryDto>>> GetAll()
        {
            var user = await _utilities.GetCurrentUserAsync();
            
            var categories = await _context.Categories
                .Where(c => c.User == user)
                .Where(c => c.IsMain)
                .Include(c => c.Transactions)
                .Include(c => c.Budgets)
                .Include(c => c.Icon)
                .Include(c => c.SubCategories)
                    .ThenInclude(c => c.Transactions)
                .Include(c => c.SubCategories)
                    .ThenInclude(c => c.Budgets)
                .Include(c => c.SubCategories)
                    .ThenInclude(c => c.Icon)
                .ToListAsync();

            var categoriesDto = _mapper.Map<List<MainCategoryDto>>(categories);

            return Result<List<MainCategoryDto>>.Success(categoriesDto);
        }

        public async Task<Result<MainCategoryDto>> CreateCategory(CategoryCreateDto newCategory)
        {
            var user = await _utilities.GetCurrentUserAsync();

            // sprawdzenie ikony
            var icon = await _context.Icons
                .FirstOrDefaultAsync(i => i.Id == newCategory.IconId);

            if (icon == null)
                return Result<MainCategoryDto>.Failure("Invalid icon id");

            // utworzenie categorii
            var category = _mapper.Map<Category>(newCategory);
            category.Icon = icon;
            category.User = user;
            category.Transactions = [];
            category.Budgets = [];
            category.SubCategories = [];

            // sprawdzenie nadrzędnej kategorii (jeżeli została podana)
            if (!newCategory.IsMain)
            {
                var mainCategory = await _context.Categories
                    .Include(c => c.Transactions)
                    .Include(c => c.Budgets)
                    .Include(c => c.Icon)
                    .Include(c => c.SubCategories)
                        .ThenInclude(c => c.Transactions)
                    .Include(c => c.SubCategories)
                        .ThenInclude(c => c.Budgets)
                    .Include(c => c.SubCategories)
                        .ThenInclude(c => c.Icon)
                    .Where(c => c.UserId == user.Id)
                    .Where(c => c.IsMain)
                    .Where(c => c.Id == newCategory.MainCategoryId)
                    .FirstOrDefaultAsync();

                if (mainCategory == null)
                    return Result<MainCategoryDto>
                        .Failure("Invalid main category id. Category does not exist or does not belong to the user.");

                // sprawdzenie czy typ transakcji się zgadza
                if (mainCategory.Type != category.Type)
                    return Result<MainCategoryDto>
                        .Failure("The type of the subcategory must be the same as the main category");

                category.MainCategory = mainCategory;
            }
            else
                category.MainCategoryId = null;

            _context.Categories.Add(category);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<MainCategoryDto>.Failure("Failed to create category");

            // utworzenie obiektu DTO
            MainCategoryDto mainCategoryDto;
            if (category.IsMain)
                mainCategoryDto = _mapper.Map<MainCategoryDto>(category);
            else
                mainCategoryDto = _mapper.Map<MainCategoryDto>(category.MainCategory);

            return Result<MainCategoryDto>.Success(mainCategoryDto);
        }

        public async Task<Result<object>> DeleteCategory(int categoryId)
        {   
            // sprawdzenie czy istnieje
            var category = await _context.Categories
                .Include(c => c.Transactions)
                .Include(c => c.Budgets)
                .Include(c => c.SubCategories)
                    .ThenInclude(c => c.Transactions)
                .Include(c => c.SubCategories)
                    .ThenInclude(c => c.Budgets)
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null) return null;

            // nie można usunąć kategorii, do której przypisane są transakcje lub budżety
            if (!category.IsMain)
            {
                if (category.Transactions.Count > 0 || category.Budgets.Count > 0)
                    return Result<object>
                        .Failure("Cannot delete a category with transactions or budgets assigned. " +
                            "You must first delete these budgets and transactions.");
            }
            
            if(category.IsMain)
            {
                if (category.Budgets.Count > 0)
                    return Result<object>
                        .Failure("Cannot delete a category with budgets assigned. " +
                            "You must first delete these budgets.");


                foreach (var subCategory in category.SubCategories)
                {
                    if (subCategory.Transactions.Count > 0 || subCategory.Budgets.Count > 0)
                        return Result<object>
                            .Failure("Category cannot be deleted. " +
                                "One or more of its subcategories have budgets or transactions assigned to them. " +
                                "You must first delete these budgets or transactions.");

                    _context.Categories.Remove(subCategory);
                }
            }

            // usunięcie kategorii
            _context.Categories.Remove(category);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete category");

            return Result<object>.Success(null);
        }

        public async Task<Result<MainCategoryDto>> UpdateCategory(int categoryId, CategoryUpdateDto updatedCategory)
        {   
            // sprawdzenie czy istnieje
            var category = await _context.Categories
                .Include(c => c.SubCategories)
                .Include(c => c.MainCategory)
                    .ThenInclude(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null) return null;

            // sprawdzenie ikony
            var icon = await _context.Icons
                .FirstOrDefaultAsync(i => i.Id == updatedCategory.IconId);

            if (icon == null)
                return Result<MainCategoryDto>.Failure("Invalid icon id");

            // aktualizacja kategorii
            _mapper.Map(updatedCategory, category);
            category.Icon = icon;

            _context.Categories.Update(category);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<MainCategoryDto>.Failure("Failed to create category");

            // utworzenie obiektu DTO
            MainCategoryDto mainCategoryDto;
            if (category.IsMain)
                mainCategoryDto = _mapper.Map<MainCategoryDto>(category);
            else
                mainCategoryDto = _mapper.Map<MainCategoryDto>(category.MainCategory);

            return Result<MainCategoryDto>.Success(mainCategoryDto);
        }

        public async Task<Result<object>> CreateDefaultCategories(string userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return Result<object>.Failure("User do not exist");

            var icons = await _context.Icons
                .ToListAsync();

            // categories for user

            TransactionType expense = TransactionType.Expense;

            var expenseCategories = new List<Category>
            {
                new()
                {
                    Icon = icons.First(i => i.Id == 1),
                    Name = "Home",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Rent", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Bills", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Furniture", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Appliances", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Decorations", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Insurance", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Renovation", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Repairs", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 1), Name = "Other (Home)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 2),
                    Name = "Food",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 2), Name = "Groceries", Type = expense, User = user }, 
                        new() { Icon = icons.First(i => i.Id == 2), Name = "Eating out", Type = expense, User = user }, 
                        new() { Icon = icons.First(i => i.Id == 2), Name = "Other (Food)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 3),
                    Name = "Recreation",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 3), Name = "Books", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 3), Name = "Events", Type = expense, User = user }, 
                        new() { Icon = icons.First(i => i.Id == 3), Name = "Cafe, bars", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 3), Name = "Sport, hobby", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 3), Name = "Subscriptions", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 3), Name = "Other (Recreation)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 4),
                    Name = "Transportation",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 4), Name = "Leasing", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 4), Name = "Maintenance", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 4), Name = "Insurance", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 4), Name = "Fuel", Type = expense, User = user }, 
                        new() { Icon = icons.First(i => i.Id == 4), Name = "Fees", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 4), Name = "Public transport, taxi", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 4), Name = "Other (Transportation)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 5),
                    Name = "Travels",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 5), Name = "Accomodation", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 5), Name = "Transport", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 5), Name = "Food, beverages", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 5), Name = "Entertainment", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 5), Name = "Other (Travels)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 6),
                    Name = "Health",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 6), Name = "Medical Expenses", Type = expense, User = user},
                        new() { Icon = icons.First(i => i.Id == 6), Name = "Medications", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 6), Name = "Supplements", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 6), Name = "Dental Care", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 6), Name = "Therapy & Counseling", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 6), Name = "Wellness, beauty", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 6), Name = "Health insurance", Type = expense, User = user},
                        new() { Icon = icons.First(i => i.Id == 6), Name = "Other (Health)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 7),
                    Name = "Investment",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 7), Name = "ETF index funds", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 7), Name = "Shares", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 7), Name = "Bonds", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 7), Name = "Mutual funds", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 7), Name = "Business", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 7), Name = "Other (Investment)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 8),
                    Name = "Financial",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 8), Name = "Taxes", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 8), Name = "Fees", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 8), Name = "Gifts", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 8), Name = "Charity", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 8), Name = "Other (Financial)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 9),
                    Name = "Shopping",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 9), Name = "Clothing", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 9), Name = "Electronics", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 9), Name = "Education", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 9), Name = "Pets", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 9), Name = "Other (Shopping)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 10),
                    Name = "Kids",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 10), Name = "Clothing", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 10), Name = "Education", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 10), Name = "Activities", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 10), Name = "Pocketmoney", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 10), Name = "Toys", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 10), Name = "Healthcare", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 10), Name = "Childcare", Type = expense, User = user },
                        new() { Icon = icons.First(i => i.Id == 10), Name = "Other (Kids)", Type = expense, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 15),
                    Name = "Other",
                    Type = expense,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 15), Name = "No category", Type = expense, User = user }
                    }
                }
            };

            _context.Categories.AddRange(expenseCategories);

            TransactionType income = TransactionType.Income;

            var incomeCategories = new List<Category>
            {
                new()
                {
                    Icon = icons.First(i => i.Id == 11),
                    Name = "Earnings",
                    Type = income,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 11), Name = "Salary", Type = income, User = user },
                        new() { Icon = icons.First(i => i.Id == 11), Name = "Pension", Type = income, User = user },
                        new() { Icon = icons.First(i => i.Id == 11), Name = "Odd jobs", Type = income, User = user },
                        new() { Icon = icons.First(i => i.Id == 11), Name = "Scholarship", Type = income, User = user },
                        new() { Icon = icons.First(i => i.Id == 11), Name = "Business Profit", Type = income, User = user },
                        new() { Icon = icons.First(i => i.Id == 11), Name = "Other (Earnings)", Type = income, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 14),
                    Name = "Investment",
                    Type = income,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 14), Name = "Interest", Type = income, User = user },
                        new() { Icon = icons.First(i => i.Id == 14), Name = "Dividends", Type = income, User = user },
                        new() { Icon = icons.First(i => i.Id == 14), Name = "Other (Investment)", Type = income, User = user }
                    }
                },
                new()
                {
                    Icon = icons.First(i => i.Id == 15),
                    Name = "Other",
                    Type = income,
                    IsMain = true,
                    User = user,
                    SubCategories = new List<Category>()
                    {
                        new() { Icon = icons.First(i => i.Id == 15), Name = "Gifts", Type = income, User = user },
                        new() { Icon = icons.First(i => i.Id == 15), Name = "No category", Type = income, User = user }
                    }
                }
            };

            _context.Categories.AddRange(incomeCategories);

            // zapisanie zmian w bazie
            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to create default categories");

            return Result<object>.Success(null);
        }
    }
}

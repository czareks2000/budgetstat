using Application.Core;
using Application.Dto.Category;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
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
            
            var categoriesDto = await _context.Categories
                .Where(c => c.User == user)
                .Where(c => c.IsMain)
                .Include(c => c.SubCategories)
                .ProjectTo<MainCategoryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

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

            // sprawdzenie nadrzędnej kategorii (jeżeli została podana)
            if (!newCategory.IsMain)
            {
                var mainCategory = await _context.Categories
                    .Include(c => c.SubCategories)
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
    }
}

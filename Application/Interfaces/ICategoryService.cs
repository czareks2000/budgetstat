using Application.Core;
using Application.Dto.Category;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        // przeglądanie kategorii
        Task<Result<List<MainCategoryDto>>> GetAll();
        // dodatnie kategorii
        Task<Result<MainCategoryDto>> CreateCategory(CategoryCreateDto newCategory);
        // usunięcie kategorii
        Task<Result<object>> DeleteCategory(int categoryId);
        // edycja kategorii
        Task<Result<MainCategoryDto>> UpdateCategory(int categoryId, CategoryUpdateDto updatedCategory);
    }
}

using Application.Core;
using Application.Dto.Category;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        // przeglądanie kategorii
        Task<Result<List<MainCategoryDto>>> GetAll();
        // dodatnie kategorii
        // usunięcie kategorii
        // edycja kategorii
    }
}

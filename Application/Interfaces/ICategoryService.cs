using Application.Core;
using Application.Dto.Category;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<List<MainCategoryDto>>> GetAll();
    }
}

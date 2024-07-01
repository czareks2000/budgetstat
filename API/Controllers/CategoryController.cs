using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoryController(
        ICategoryService categoryService) : BaseApiController
    {
        private readonly ICategoryService _categoryService = categoryService;

        [HttpGet("categories")] //api/categories
        public async Task<IActionResult> GetAllCategories()
        {
            return HandleResult(await _categoryService.GetAll());
        }
    }
}

using Application.Dto.Category;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost("categories")] //api/categories
        public async Task<IActionResult> CreateCategory(CategoryCreateDto newCategory)
        {
            return HandleResult(await _categoryService.CreateCategory(newCategory));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("categories/{categoryId}")] //api/categories/{categoryId}
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            return HandleResult(await _categoryService.DeleteCategory(categoryId));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPut("categories/{categoryId}")] //api/categories/{categoryId}
        public async Task<IActionResult> UpdateCategory(int categoryId, CategoryUpdateDto updatedCategory)
        {
            return HandleResult(await _categoryService.UpdateCategory(categoryId, updatedCategory));
        }
    }
}

using Application.Core;
using Application.Dto.Category;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    }
}

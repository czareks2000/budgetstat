using Application.Core;
using Application.Dto.Icon;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class IconService(
        DataContext context,
        IMapper mapper) : IIconService
    {
        private readonly DataContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<List<IconDto>>> GetIcons()
        {
            var icons = await _context.Icons
                .ProjectTo<IconDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<IconDto>>.Success(icons);
        }
    }
}

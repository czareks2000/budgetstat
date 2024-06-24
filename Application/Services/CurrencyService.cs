using Application.Core;
using Application.Dto;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class CurrencyService(
        DataContext context,
        IMapper mapper) : ICurrencyService
    {
        private readonly DataContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<List<CurrencyDto>>> GetAll()
        {
            var currenciesDto = await _context.Currencies
                .ProjectTo<CurrencyDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<CurrencyDto>>.Success(currenciesDto);
        }
    }
}

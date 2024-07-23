using Application.Core;
using Application.Dto.Currency;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class CurrencyService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : ICurrencyService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<List<CurrencyDto>>> GetAll()
        {
            var currenciesDto = await _context.Currencies
                .ProjectTo<CurrencyDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<CurrencyDto>>.Success(currenciesDto);
        }

        public async Task<Result<decimal>> GetCurrentExchangeRate(string inputCurrencyCode, string outputCurrencyCode)
        {
            return Result<decimal>.Success(await _utilities.GetCurrentRate(inputCurrencyCode, outputCurrencyCode));
        }
    }
}

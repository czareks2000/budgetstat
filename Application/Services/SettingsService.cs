using Application.Core;
using Application.Dto.Currency;
using Application.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class SettingsService(
        DataContext context,
        IUtilities utilities,
        IMapper mapper) : ISettingsService
    {
        private readonly DataContext _context = context;
        private readonly IUtilities _utilities = utilities;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<CurrencyDto>> SetDefaultCurrency(int currencyId)
        {
            var user = await _utilities.GetCurrentUserAsync();

            var currency = await _context.Currencies
                .FirstOrDefaultAsync(c => c.Id == currencyId);

            if (currency == null) return null;

            user.DefaultCurrency = currency;

            _context.Users.Update(user);

            if(await _context.SaveChangesAsync() == 0)
                return Result<CurrencyDto>.Failure("Failed to set default currency");

            var currencyDto = _mapper.Map<CurrencyDto>(currency);

            return Result<CurrencyDto>.Success(currencyDto);
        }
    }
}

using Application.Dto;
using Application.Dto.Account;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Account, AccountDto>();
            CreateMap<AccountCreateDto, Account>();
            CreateMap<AccountUpdateDto, Account>();

            CreateMap<Currency, CurrencyDto>();
        }
    }
}
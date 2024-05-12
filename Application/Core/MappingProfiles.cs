using Application.Dto;
using Application.Dto.Account;
using Application.Dto.Budget;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Account, AccountDto>()
                .ForMember(dest => dest.Balance, opt => opt
                    .MapFrom(src => src.AccountBalances.OrderBy(ab => ab.Date).FirstOrDefault().Balance));
            CreateMap<AccountCreateDto, Account>();
            CreateMap<AccountUpdateDto, Account>();

            CreateMap<Currency, CurrencyDto>();

            CreateMap<Budget, BudgetDto>()
                .ForMember(dest => dest.Categories, opt => opt
                    .MapFrom(src => src.Categories));
            CreateMap<BudgetCreateDto, Budget>()
                .ForMember(b => b.Categories, opt => opt
                    .MapFrom(src => new List<BudgetCategory>()));
            CreateMap<BudgetUpdateDto, Budget>();

            CreateMap<BudgetCategory, CategoryDto>()
                .ForMember(dest => dest.Id, opt => opt
                    .MapFrom(src => src.Category.Id))
                .ForMember(dest => dest.Name, opt => opt
                    .MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Icon, opt => opt
                    .MapFrom(src => src.Category.Icon.Name))
                .ForMember(dest => dest.Type, opt => opt
                    .MapFrom(src => src.Category.Type));

            CreateMap<Category, CategoryDto>();
        }
    }
}
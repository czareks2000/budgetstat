using Application.Dto.Account;
using Application.Dto.Asset;
using Application.Dto.Budget;
using Application.Dto.Category;
using Application.Dto.Counterparty;
using Application.Dto.Currency;
using Application.Dto.Icon;
using Application.Dto.Loan;
using Application.Dto.Transaction;
using Application.Dto.Transfer;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<AccountCreateDto, Account>();
            CreateMap<AccountUpdateDto, Account>();
            CreateMap<Account, AccountDto>()
                .ForMember(dest => dest.Balance, opt => opt
                    .MapFrom(src => src.AccountBalances
                        .Where(ab => ab.Date.Date <= DateTime.UtcNow.Date)
                        .OrderByDescending(ab => ab.Date).FirstOrDefault().Balance));

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
                .ForMember(dest => dest.IconId, opt => opt
                    .MapFrom(src => src.Category.Icon.Id))
                .ForMember(dest => dest.Type, opt => opt
                    .MapFrom(src => src.Category.Type));

            CreateMap<CategoryCreateDto, Category>();
            CreateMap<CategoryUpdateDto, Category>();
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.IconId, opt => opt
                    .MapFrom(src => src.Icon.Id));
            CreateMap<Category, MainCategoryDto>()
                .ForMember(dest => dest.IconId, opt => opt
                    .MapFrom(src => src.Icon.Id));

            CreateMap<TransactionCreateDto, Transaction>();
            CreateMap<TransactionUpdateDto, Transaction>();
            CreateMap<PlannedTransactionDto, Transaction>();
            CreateMap<Transaction, TransactionDto>();

            CreateMap<TransferCreateUpdateDto, Transfer>();
            CreateMap<Transfer, TransferDto>();

            CreateMap<CounterpartyCreateDto, Counterparty>();
            CreateMap<Counterparty, CounterpartyDto>();

            CreateMap<LoanCreateDto, Loan>();
            CreateMap<LoanUpdateDto, Loan>();
            CreateMap<Loan, LoanDto>();

            CreateMap<PayoffCreateDto, Payoff>();
            CreateMap<Payoff, PayoffDto>();
            
            CreateMap<AssetCreateUpdateDto, Asset>();
            CreateMap<Asset, AssetDto>()
                .ForMember(dest => dest.AssetValue, opt => opt
                    .MapFrom(src => src.AssetValues
                        .OrderByDescending(ab => ab.Date).FirstOrDefault().Value))
                .ForMember(dest => dest.CurrencyId, opt => opt
                        .MapFrom(src => src.AssetValues
                            .OrderByDescending(ab => ab.Date).FirstOrDefault().CurrencyId));

            CreateMap<AssetCategory, AssetCategoryDto>();

            CreateMap<Icon, IconDto>();
        }
    }
}
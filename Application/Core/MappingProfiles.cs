using Application.Dto.Account;
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
            CreateMap<Account, AccountDto>()
                .ForMember(dest => dest.Balance, opt => opt
                    .MapFrom(src => src.AccountBalances
                        .Where(ab => ab.Date.Date <= DateTime.UtcNow.Date)
                        .OrderByDescending(ab => ab.Date).FirstOrDefault().Balance));
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

            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Icon, opt => opt
                    .MapFrom(src => src.Icon.Name));
            CreateMap<Category, MainCategoryDto>()
                .ForMember(dest => dest.Icon, opt => opt
                    .MapFrom(src => src.Icon.Name));

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

            CreateMap<Icon, IconDto>();
        }
    }
}
using Application.Dto.Account;
using Application.Dto.Asset;
using Application.Dto.Budget;
using Application.Dto.Category;
using Application.Dto.Counterparty;
using Application.Dto.Currency;
using Application.Dto.Icon;
using Application.Dto.Loan;
using Application.Dto.Transaction;
using Application.Dto.Transaction.Transfer;
using AutoMapper;
using Domain;
using Domain.Enums;

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
                        .OrderByDescending(ab => ab.Date).FirstOrDefault().Balance))
                .ForMember(dest => dest.CanBeDeleted, opt => opt
                    .MapFrom(src => !src.Loans.Where(l => l.LoanStatus == LoanStatus.InProgress).Any()));

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
                    .MapFrom(src => src.Icon.Id))
                .ForMember(dest => dest.CanBeDeleted, opt => opt
                    .MapFrom(src => src.Transactions.Count == 0 && src.Budgets.Count == 0));

            CreateMap<Category, MainCategoryDto>()
                .ForMember(dest => dest.IconId, opt => opt
                    .MapFrom(src => src.Icon.Id))
                .ForMember(dest => dest.CanBeDeleted, opt => opt
                    .MapFrom<CanBeDeletedResolver>());

            CreateMap<TransactionCreateDto, Transaction>();
            CreateMap<TransactionUpdateDto, Transaction>();
            CreateMap<PlannedTransactionCreateDto, Transaction>();
            CreateMap<Transaction, TransactionDto>();
            CreateMap<Transaction, PlannedTransactionDto>();

            // transaction list item
            CreateMap<Transaction, TransactionListItem>()
                .ForMember(dest => dest.TransactionId, opt => opt
                    .MapFrom(src => src.Id))
                .ForMember(dest => dest.AccountName, opt => opt
                    .MapFrom(src => src.Account != null ? src.Account.Name : ""))
                .ForMember(dest => dest.AccountId, opt => opt
                    .MapFrom(src => src.Account.Id))
                .ForMember(dest => dest.Amount, opt => opt
                   .MapFrom(src => src));
            CreateMap<Transaction, AmountItem>()
               .ForMember(dest => dest.Value, opt => opt
                   .MapFrom(src => src.Amount))
                .ForMember(dest => dest.Type, opt => opt
                    .MapFrom(src => src.Category.Type))
                .ForMember(dest => dest.CurrencySymbol, opt => opt
                    .MapFrom(src => src.Currency.Symbol));
            CreateMap<Category, CategoryItem>();

            CreateMap<Transfer, TransactionListItem>()
                .ForMember(dest => dest.TransactionId, opt => opt
                    .MapFrom(src => src.Id))
                .ForMember(dest => dest.AccountName, opt => opt
                    .MapFrom(src => src.ToAccount.Name))
                .ForMember(dest => dest.AccountId, opt => opt
                    .MapFrom(src => src.ToAccount.Id))
                .ForMember(dest => dest.Category, opt => opt
                    .MapFrom(src => new CategoryItem { Name = "Transfer", IconId = 16 }))
                .ForMember(dest => dest.Amount, opt => opt
                   .MapFrom(src => src))
                .ForMember(dest => dest.Description, opt => opt
                   .MapFrom(src => $"Transfer from {src.FromAccount.Name} account"))
                .ForMember(dest => dest.Considered, opt => opt
                   .MapFrom(src => false));
            CreateMap<Transfer, AmountItem>()
                .ForMember(dest => dest.Value, opt => opt
                   .MapFrom(src => src.ToAmount))
                .ForMember(dest => dest.Type, opt => opt
                    .MapFrom(src => TransactionType.Transfer))
                .ForMember(dest => dest.CurrencySymbol, opt => opt
                    .MapFrom(src => src.ToAccount.Currency.Symbol));

            CreateMap<TransferCreateUpdateDto, Transfer>();
            CreateMap<Transfer, TransferDto>();

            
            CreateMap<Transaction, TransactionFormValues>()
                .ForMember(dest => dest.Description, opt => opt
                   .MapFrom(src => src.Description ?? ""));
            CreateMap<Transfer, TransactionFormValues>()
                .ForMember(dest => dest.Description, opt => opt
                   .MapFrom(src => ""));

            CreateMap<Category, CategoryOption>()
                .ForMember(dest => dest.MainCategoryName, opt => opt
                   .MapFrom(src => src.MainCategory.Name));

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
            CreateMap<AssetValue, AssetValueDto>();
            CreateMap<AssetValueCreateDto, AssetValue>();

            CreateMap<AssetCategory, AssetCategoryDto>();

            CreateMap<Icon, IconDto>();
        }
    }

    public class CanBeDeletedResolver : IValueResolver<Category, MainCategoryDto, bool>
    {
        public bool Resolve(Category source, MainCategoryDto destination, bool destMember, ResolutionContext context)
        {
            if (source.Budgets.Count > 0)
                return false;

            foreach (var subCategory in source.SubCategories)
            {
                if (subCategory.Transactions.Count > 0 || subCategory.Budgets.Count > 0)
                    return false;
            }
            return true;
        }
    }
}
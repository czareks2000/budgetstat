using Application.Core;
using Application.Dto.Budget;
using Application.Interfaces;
using AutoMapper;
using Persistence;

namespace Application.Services
{
    public class BudgetService(
        DataContext context,
        IUserAccessor userAccessor,
        ICurrencyService currencyService,
        IMapper mapper) : IBudgetService
    {
        private readonly DataContext _context = context;
        private readonly IUserAccessor _userAccessor = userAccessor;
        private readonly ICurrencyService _currencyService = currencyService;
        private readonly IMapper _mapper = mapper; 

        public async Task<Result<int>> Create(BudgetCreateDto newBudget)
        {
            await Task.Delay(1);
            throw new NotImplementedException();
        }

        public async Task<Result<object>> Delete(int budgetId)
        {
            var budget = await _context.Budgets.FindAsync(budgetId);

            if (budget == null) return null;

            _context.Budgets.Remove(budget);

            if (await _context.SaveChangesAsync() == 0)
                return Result<object>.Failure("Failed to delete budget");

            return Result<object>.Success(null);
        }

        public async Task<Result<IEnumerable<BudgetDto>>> GetAll()
        {
            await Task.Delay(1);
            throw new NotImplementedException();
        }

        public async Task<Result<BudgetDto>> Update(int budgetId, BudgetUpdateDto updatedBudget)
        {
            await Task.Delay(1);
            throw new NotImplementedException();
        }
    }
}

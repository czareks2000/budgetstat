using Application.Core;
using Application.Dto.Budget;

namespace Application.Interfaces
{
    public interface IBudgetService
    {   
        // utworzenie budżetu
        Task<Result<BudgetDto>> Create(BudgetCreateDto newBudget);
        // edycja budżetu
        Task<Result<BudgetDto>> Update(int budgetId, BudgetUpdateDto updatedBudget);
        // usunięcie bużetu
        Task<Result<object>> Delete(int budgetId);
        // pobranie listy budżetów
        Task<Result<List<BudgetDto>>> GetAll();
        // pobranie pojednyczego bużetu
        Task<Result<BudgetDto>> Get(int budgetId);
    }
}

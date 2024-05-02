using Application.Core;
using Application.Dto.Budget;

namespace Application.Interfaces
{
    public interface IBudgetService
    {   
        // utworzenie budżetu
        Task<Result<int>> Create(BudgetCreateDto newBudget);
        // edycja budżetu
        Task<Result<BudgetDto>> Update(int budgetId, BudgetUpdateDto updatedBudget);
        // aktualizacja listy kategorii
        Task<Result<BudgetDto>> UpdateCategories(int budgetId, List<int> categoryIds);
        // usunięcie bużetu
        Task<Result<object>> Delete(int budgetId);
        // pobranie listy budżetów
        Task<Result<List<BudgetDto>>> GetAll();
    }
}

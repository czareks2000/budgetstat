using Application.Dto.Budget;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BudgetController(
        IBudgetService budgetService) : BaseApiController
    {
        private readonly IBudgetService _budgetService = budgetService;

        [HttpGet("budgets")] //api/budgets
        public async Task<IActionResult> GetBudgets()
        {
            return HandleResult(await _budgetService.GetAll());
        }

        [HttpPost("budgets")] //api/budgets
        public async Task<IActionResult> CreateBudget(BudgetCreateDto newBudget)
        {
            return HandleResult(await _budgetService.Create(newBudget));
        }

        [HttpDelete("budgets/{budgetId}")] //api/budgets/{budgetId}
        public async Task<IActionResult> DeleteBudget(int budgetId)
        {
            return HandleResult(await _budgetService.Delete(budgetId));
        }

        [HttpPut("budgets/{budgetId}")] //api/budgets/{budgetId}
        public async Task<IActionResult> UpdateBudget(int budgetId, BudgetUpdateDto updatedBudget)
        {
            return HandleResult(await _budgetService.Update(budgetId, updatedBudget));
        }
    }
}

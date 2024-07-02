using Application.Dto.Budget;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Policy = "IsOwner")]
        [HttpGet("budgets/{budgetId}")] //api/budgets/{budgetId}
        public async Task<IActionResult> Get(int budgetId)
        {
            return HandleResult(await _budgetService.Get(budgetId));
        }

        [HttpPost("budgets")] //api/budgets
        public async Task<IActionResult> CreateBudget(BudgetCreateDto newBudget)
        {
            return HandleResult(await _budgetService.Create(newBudget));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("budgets/{budgetId}")] //api/budgets/{budgetId}
        public async Task<IActionResult> DeleteBudget(int budgetId)
        {
            return HandleResult(await _budgetService.Delete(budgetId));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPut("budgets/{budgetId}")] //api/budgets/{budgetId}
        public async Task<IActionResult> UpdateBudget(int budgetId, BudgetUpdateDto updatedBudget)
        {
            return HandleResult(await _budgetService.Update(budgetId, updatedBudget));
        }
    }
}

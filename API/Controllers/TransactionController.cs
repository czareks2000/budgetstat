using Application.Dto.Transactions;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TransactionController(
        ITransactionService transactionService) : BaseApiController
    {
        private readonly ITransactionService _transactionService = transactionService;

        [Authorize(Policy = "IsOwner")]
        [HttpPost("account/{accountId}/transactions")] //api/account/{accountId}/transactions
        public async Task<IActionResult> CreateTransaction(int accountId, TransactionCreateDto newTransaction)
        {
            return HandleResult(await _transactionService.Create(accountId, newTransaction));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("transactions/{transactionId}")] //api/transactions/{transactionId}
        public async Task<IActionResult> DeleteTransaction(int transactionId)
        {
            return HandleResult(await _transactionService.Delete(transactionId));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPatch("transactions/{transactionId}/considered")] //api/transactions/{transactionId}
        public async Task<IActionResult> ToggleConsideredFlag(int transactionId)
        {
            return HandleResult(await _transactionService.ToggleConsideredFlag(transactionId));
        }

    }
}

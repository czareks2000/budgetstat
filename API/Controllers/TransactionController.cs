using Application.Dto.Transaction;
using Application.Dto.Transaction.Transfer;
using Application.Interfaces;
using Domain.Enums;
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
        [HttpPost("account/{accountId}/transactions/planned")] //api/account/{accountId}/transactions/planned
        public async Task<IActionResult> CreatePlannedTransaction(int accountId, PlannedTransactionCreateDto plannedTransaction)
        {
            return HandleResult(await _transactionService.CreatePlannedTransactions(accountId, plannedTransaction));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPatch("transactions/{transactionId}/confirm")] //api/transactions/{transactionId}/confirm
        public async Task<IActionResult> ConfirmTransaction(int transactionId)
        {
            return HandleResult(await _transactionService.ConfirmTransaction(transactionId));
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

        [Authorize(Policy = "IsOwner")]
        [HttpPut("transactions/{transactionId}")] //api/transactions/{transactionId}
        public async Task<IActionResult> UpdateTransaction(int transactionId, TransactionUpdateDto updatedTransaction)
        {
            return HandleResult(await _transactionService.Update(transactionId, updatedTransaction));
        }

        [HttpPost("transfers")] //api/transfers
        public async Task<IActionResult> CreateTransfer(TransferCreateUpdateDto newTransfer)
        {
            return HandleResult(await _transactionService.Create(newTransfer));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("transfers/{transferId}")] //api/transfers/{transferId}
        public async Task<IActionResult> DeleteTransfer(int transferId)
        {
            return HandleResult(await _transactionService.DeleteTransfer(transferId));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPut("transfers/{transferId}")] //api/transfers/{transferId}
        public async Task<IActionResult> UpdateTransfer(int transferId, TransferCreateUpdateDto updatedTransfer)
        {
            return HandleResult(await _transactionService.Update(transferId, updatedTransfer));
        }

        [HttpGet("transactions")] //api/transactions?
        public async Task<IActionResult> GetTransactions([FromQuery] TransactionParams param)
        {
            return HandleResult(await _transactionService.GetTransactions(param));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpGet("transactions/{transactionId}/")] //api/transactions
        public async Task<IActionResult> GetTransactionFormValues(int transactionId, [FromQuery] TransactionType type)
        {
            return HandleResult(await _transactionService.Get(transactionId, type));
        }

        [HttpGet("transactions/planned")] //api/transactions
        public async Task<IActionResult> GetPlannedTransactions([FromQuery] bool onlyTransactionsUpToTomorrow = false)
        {
            return HandleResult(await _transactionService.GetPlannedTransactions(onlyTransactionsUpToTomorrow));
        }
    }
}

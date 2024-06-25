using Application.Dto.Account;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController(
        IAccountService accountService) : BaseApiController
    {
        private readonly IAccountService _accountService = accountService;

        [HttpGet("accounts")] //api/accounts
        public async Task<IActionResult> GetAccounts()
        {
            return HandleResult(await _accountService.GetAll());
        }

        [HttpPost("accounts")] //api/accounts
        public async Task<IActionResult> CreateAccount(AccountCreateDto newAccount)
        {
            return HandleResult(await _accountService.Create(newAccount));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPut("accounts/{accountId}")] //api/accounts/{accountId}
        public async Task<IActionResult> UpdateAccount(int accountId, AccountUpdateDto newAccount)
        {
            return HandleResult(await _accountService.Update(accountId, newAccount));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpPatch("accounts/{accountId}/{newStatus}")] //api/accounts/{accountId}/{newStatus}
        public async Task<IActionResult> UpdateAccountStatus(int accountId, AccountStatus newStatus)
        {
            return HandleResult(await _accountService.ChangeStatus(accountId, newStatus));
        }

        [Authorize(Policy = "IsOwner")]
        [HttpDelete("accounts/{accountId}")] //api/accounts/{accountId}?deleteRelatedTransactions=true
        public async Task<IActionResult> DeleteAccount(int accountId, [FromQuery] bool deleteRelatedTransactions = false)
        {
            return HandleResult(await _accountService.Delete(accountId, deleteRelatedTransactions));
        }
    }
}

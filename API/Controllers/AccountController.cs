using Application.Dto.Account;
using Application.Interfaces;
using Domain.Enums;
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

        [HttpPut("accounts/{accountId}")] //api/accounts/{accountId}
        public async Task<IActionResult> UpdateAccount(int accountId, AccountUpdateDto newAccount)
        {
            return HandleResult(await _accountService.Update(accountId, newAccount));
        }

        [HttpPatch("accounts/{accountId}/{newStatus}")] //api/accounts/{accountId}/{newStatus}
        public async Task<IActionResult> UpdateAccount(int accountId, AccountStatus newStatus)
        {
            return HandleResult(await _accountService.ChangeStatus(accountId, newStatus));
        }
    }
}

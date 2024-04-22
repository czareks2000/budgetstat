using Application.Interfaces;
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
    }
}

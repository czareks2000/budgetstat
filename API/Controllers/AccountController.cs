using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class AccountController : BaseApiController
    {

        [HttpGet("accounts/all")]
        public IActionResult Accounts()
        {
            return Ok();
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/account/")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        [HttpGet("all")]
        public IActionResult Accounts()
        {
            return Ok();
        }
    }
}

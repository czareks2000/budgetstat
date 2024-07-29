using API.Dto;
using API.Interfaces;
using Application.Core;
using Application.Dto.Loan;
using Application.Interfaces;
using Application.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(
        UserManager<User> userManager,
        DataContext context,
        ICategoryService categoryService,
        ITokenService tokenService,
        IUserAccessor userAccessor) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly DataContext _context = context;
        private readonly ICategoryService _categoryService = categoryService;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IUserAccessor _userAccessor = userAccessor;

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
                return CreateUserObject(user);

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("userName", "Username taken");
                return ValidationProblem(ModelState);
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem(ModelState);
            }

            var currency = _context.Currencies
                .FirstOrDefault(c => c.Id == registerDto.DefaultCurrencyId);

            if (currency == null)
            {
                ModelState.AddModelError("defaultCurrencyId", "Invalid currency");
                return ValidationProblem(ModelState);
            }

            var user = new User
            {
                Email = registerDto.Email,
                UserName = registerDto.UserName,
                CurrencyId = currency.Id,
                DefaultCurrency = currency,
                Categories = []
            };

            var identityResult = await _userManager.CreateAsync(user, registerDto.Password);

            if (!identityResult.Succeeded)
                return BadRequest(identityResult.Errors);

            var categoryResult = await _categoryService.CreateDefaultCategories(user.Id);

            if (!categoryResult.IsSucess)
            {
                await _userManager.DeleteAsync(user);

                return BadRequest(categoryResult.Error);
            }

            return CreateUserObject(user);
        }

        [Authorize]
        [HttpDelete("deleteuser")]
        public async Task<IActionResult> DeleteUser()
        {
            var user = await _context.Users
                .Include(u => u.Categories)
                .FirstOrDefaultAsync(u => u.Email == _userAccessor.GetUserEmail());

            if (user == null) return NotFound();

            _context.RemoveRange(user.Categories);

            var identityResult = await _userManager.DeleteAsync(user);

            if (!identityResult.Succeeded)
                return BadRequest(identityResult.Errors);

            return Ok();
        }

        [Authorize]
        [HttpPost("changepassword")]
        public async Task<ActionResult<UserDto>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(_userAccessor.GetUserEmail());

            var result = await _userManager.ChangePasswordAsync(
                user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            ModelState.AddModelError("currentpassword", "Invalid password");
            return ValidationProblem(ModelState);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(User user)
        {
            return new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                CurrencyId = user.CurrencyId
            };
        }
    }
}

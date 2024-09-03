using API.Dto;
using API.Interfaces;
using Application.Core;
using Application.Dto.Mail;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace API.Controllers
{
    public class AuthController(
        UserManager<User> userManager,
        DataContext context,
        IMailService mailService,
        ICategoryService categoryService,
        ITokenService tokenService,
        IUserAccessor userAccessor) : BaseApiController
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly DataContext _context = context;
        private readonly IMailService _mailService = mailService;
        private readonly ICategoryService _categoryService = categoryService;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IUserAccessor _userAccessor = userAccessor;

        [AllowAnonymous]
        [HttpPost("auth/login")]
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
        [HttpPost("auth/register")]
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

        [HttpDelete("auth/deleteuser")]
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

        [AllowAnonymous]
        [HttpGet("auth/test-email")]
        public async Task<IActionResult> TestEmail([FromQuery] string email)
        {
            var message = new Message(
                [email],
                subject: "Testing",
                content: "Test"
            );

            return HandleResult(await _mailService.SendEmail(message));
        }

        [AllowAnonymous]
        [HttpPost("auth/forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return BadRequest("Invalid Email");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetPasswordLink = token;

            var message = new Message(
                [request.Email],
                subject: "Reset password link",
                content: resetPasswordLink
            );

            return HandleResult(await _mailService.SendEmail(message));
        }

        [AllowAnonymous]
        [HttpPost("auth/reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);

            if (user == null)
                return BadRequest("Invalid Email");

            var resetPassResult = await _userManager.ResetPasswordAsync(
                user,
                resetPasswordDto.Token,
                resetPasswordDto.NewPassword);

            if (resetPassResult.Succeeded)
                return Ok();


            return BadRequest(resetPassResult.Errors);
        }

        [HttpPost("auth/changepassword")]
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

        [HttpGet("auth")]
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

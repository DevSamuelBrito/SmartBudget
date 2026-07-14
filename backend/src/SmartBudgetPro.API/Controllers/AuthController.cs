using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using SmartBudgetPro.API.Extensions;
using SmartBudgetPro.Application.UseCases.Auth.Login;
using SmartBudgetPro.Application.UseCases.Auth.Logout;
using SmartBudgetPro.Application.UseCases.Auth.RefreshToken;
using SmartBudgetPro.Application.UseCases.Auth.ForgotPassword;
using SmartBudgetPro.Application.UseCases.Auth.ResetPassword;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("auth")]
[Authorize]
public class AuthController(
    LoginUseCase loginUseCase,
    RefreshTokenUseCase refreshTokenUseCase,
    LogoutUseCase logoutUseCase,
    ForgotPasswordUseCase forgotPasswordUseCase,
    ResetPasswordUseCase resetPasswordUseCase) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUseCaseInput input)
    {
        var output = await loginUseCase.ExecuteAsync(input);
        return Ok(output);
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenUseCaseInput input)
    {
        var output = await refreshTokenUseCase.ExecuteAsync(input);
        return Ok(output);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = User.GetRequiredUserId();
        await logoutUseCase.ExecuteAsync(new LogoutUseCaseInput(userId));
        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordUseCaseInput input)
    {
        await forgotPasswordUseCase.ExecuteAsync(input);
        return Ok(new { message = "If this email is registered, you will receive a password reset link shortly." });
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordUseCaseInput input)
    {
        await resetPasswordUseCase.ExecuteAsync(input);
        return NoContent();
    }
}

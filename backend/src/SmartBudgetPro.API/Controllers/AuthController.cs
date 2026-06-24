using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using SmartBudgetPro.API.Extensions;
using SmartBudgetPro.Application.UseCases.Auth.Login;
using SmartBudgetPro.Application.UseCases.Auth.Logout;
using SmartBudgetPro.Application.UseCases.Auth.RefreshToken;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("auth")]
[Authorize]
public class AuthController(
    LoginUseCase loginUseCase,
    RefreshTokenUseCase refreshTokenUseCase,
    LogoutUseCase logoutUseCase) : ControllerBase
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
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using SmartBudgetPro.Application.UseCases.Auth.Login;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("auth")]
[Authorize]
public class AuthController(LoginUseCase loginUseCase) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUseCaseInput input)
    {
        var output = await loginUseCase.ExecuteAsync(input);

        return Ok(output);
    }
}
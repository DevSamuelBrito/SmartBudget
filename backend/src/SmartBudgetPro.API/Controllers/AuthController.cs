using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.Auth.Login;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(LoginUseCase loginUseCase) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUseCaseInput input)
    {
        var output = await loginUseCase.ExecuteAsync(input);

        return Ok(output);
    }
}
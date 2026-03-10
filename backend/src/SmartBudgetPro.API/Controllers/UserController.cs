using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.User.CreateUser;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(CreateUserUseCase createUserUseCase) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserUseCaseInput input)
        {
            var output = await createUserUseCase.ExecuteAsync(input);

            return Created($"api/users/{output.UserId}", output);
        }
    }
}

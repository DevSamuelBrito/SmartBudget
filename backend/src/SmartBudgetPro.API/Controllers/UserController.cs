using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.GetAllUsers;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController(CreateUserUseCase createUserUseCase, GetAllUsersUseCase getAllUsersUseCase) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var output = await getAllUsersUseCase.ExecuteAsync();
            return Ok(output);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserUseCaseInput input)
        {
            var output = await createUserUseCase.ExecuteAsync(input);

            return Created($"api/users/{output.UserId}", output);
        }
    }
}

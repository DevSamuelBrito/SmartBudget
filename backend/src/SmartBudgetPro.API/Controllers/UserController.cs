using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.GetAllUsers;
using SmartBudgetPro.Application.UseCases.User.GetUserByID;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController(CreateUserUseCase createUserUseCase, GetAllUsersUseCase getAllUsersUseCase, GetUserByIDUseCase getUserByIDUseCase) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var output = await getAllUsersUseCase.ExecuteAsync();
            return Ok(output);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(Guid id)
        {
            var output = await getUserByIDUseCase.ExecuteAsync(id);
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

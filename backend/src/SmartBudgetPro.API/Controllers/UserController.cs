using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.DeleteUser;
using SmartBudgetPro.Application.UseCases.User.GetAllUsers;
using SmartBudgetPro.Application.UseCases.User.GetUserByID;
using SmartBudgetPro.Application.UseCases.User.UpdateUser;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController
    (
        GetAllUsersUseCase getAllUsersUseCase,
        GetUserByIDUseCase getUserByIDUseCase,
        CreateUserUseCase createUserUseCase,
        UpdateUserUseCase updateUserUseCase,
        DeleteUserUseCase deleteUserUseCase
    ) : ControllerBase
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

            return Created($"api/users/{output.Id}", output);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserUseCaseInput input)
        {
            await updateUserUseCase.ExecuteAsync(id, input);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await deleteUserUseCase.ExecuteAsync(id);

            return NoContent();
        }

    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.API.Extensions;
using SmartBudgetPro.Application.UseCases.User.ChangeUserPassword;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.DeleteUser;
using SmartBudgetPro.Application.UseCases.User.GetAllUsers;
using SmartBudgetPro.Application.UseCases.User.GetUserByID;
using SmartBudgetPro.Application.UseCases.User.UpdateUser;
using SmartBudgetPro.Application.UseCases.User.UpdateUserProfile;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController
    (
        GetAllUsersUseCase getAllUsersUseCase,
        GetUserByIDUseCase getUserByIDUseCase,
        CreateUserUseCase createUserUseCase,
        UpdateUserUseCase updateUserUseCase,
        DeleteUserUseCase deleteUserUseCase,
        UpdateUserProfileUseCase updateUserProfileUseCase,
        ChangeUserPasswordUseCase changeUserPasswordUseCase
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
            var userId = User.GetRequiredUserId();
            var output = await getUserByIDUseCase.ExecuteAsync(userId);

            return Ok(output);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileUseCaseInput input)
        {
            var userId = User.GetRequiredUserId();

            await updateUserProfileUseCase.ExecuteAsync(userId, input);

            return NoContent();
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangeUserPasswordUseCaseInput input)
        {
            var userId = User.GetRequiredUserId();

            await changeUserPasswordUseCase.ExecuteAsync(userId, input);

            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserUseCaseInput input)
        {
            var output = await createUserUseCase.ExecuteAsync(input);

            return Created($"api/users/{output.Id}", output);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserUseCaseInput input)
        {
            var userId = User.GetRequiredUserId();
            await updateUserUseCase.ExecuteAsync(userId, input);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = User.GetRequiredUserId();
            await deleteUserUseCase.ExecuteAsync(userId);

            return NoContent();
        }

    }
}

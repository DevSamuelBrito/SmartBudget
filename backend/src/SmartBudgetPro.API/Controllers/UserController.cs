using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using SmartBudgetPro.API.Extensions;
using SmartBudgetPro.Application.UseCases.User.ChangeUserPassword;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.DeleteUser;
using SmartBudgetPro.Application.UseCases.User.UpdateUser;
using SmartBudgetPro.Application.UseCases.User.UpdateUserProfile;
using SmartBudgetPro.Application.UseCases.User.UpgradeUserToPremium;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("users")]
    [Authorize]
    public class UserController
    (
        CreateUserUseCase createUserUseCase,
        UpdateUserUseCase updateUserUseCase,
        DeleteUserUseCase deleteUserUseCase,
        UpdateUserProfileUseCase updateUserProfileUseCase,
        ChangeUserPasswordUseCase changeUserPasswordUseCase,
        UpgradeUserToPremiumUseCase upgradeUserToPremiumUseCase
    ) : ControllerBase
    {

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

            return Created(string.Empty, output);
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

        [HttpPut("upgrade")]
        public async Task<IActionResult> Upgrade()
        {
            var userId = User.GetRequiredUserId();
            var output = await upgradeUserToPremiumUseCase.ExecuteAsync(userId);

            return Ok(output);
        }

    }
}

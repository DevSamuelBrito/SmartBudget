using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.User.GetUserByID;

public class GetUserByIDUseCase(IUserRepository userRepository)
{
    public async Task<UserDto> ExecuteAsync(Guid userId)
    {
        var user = await userRepository.GetByIdAsync(userId);

        if (user == null)
            throw new InvalidOperationException("User not found");

        return new UserDto(user.Id, user.Name, user.Email);
    }
}

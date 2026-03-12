using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.UpdateUser;

public class UpdateUserUseCase(IUserRepository userRepository)
{
    public async Task ExecuteAsync(Guid userId, UpdateUserUseCaseInput input)
    {
        var user = await userRepository.GetByIdAsync(userId);

        if (user == null)
            throw new InvalidOperationException("User not found.");

        user.Update(input.Name, input.Email);

        await userRepository.UpdateAsync(user);
    }
}

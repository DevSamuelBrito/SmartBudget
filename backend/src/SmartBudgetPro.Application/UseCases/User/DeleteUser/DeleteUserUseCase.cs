using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.User.DeleteUser;

public class DeleteUserUseCase(IUserRepository userRepository)
{
    public async Task ExecuteAsync(Guid userId)
    {
        await userRepository.DeleteAsync(userId);
    }
}

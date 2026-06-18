using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.User.UpgradeUserToPremium;

public class UpgradeUserToPremiumUseCase(IUserRepository userRepository)
{
    public async Task<UpgradeUserToPremiumUseCaseOutput> ExecuteAsync(Guid userId)
    {
        var user = await userRepository.GetByIdAsync(userId);

        if (user is null)
            throw new UserNotFoundException();

        user.UpgradeToPremium();

        await userRepository.UpdateAsync(user);

        return new UpgradeUserToPremiumUseCaseOutput(user.Id, user.Name, user.Email, user.IsPremium);
    }
}

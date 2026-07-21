using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.User.UpgradeUserToPremium;

public class UpgradeUserToPremiumUseCase(IUserRepository userRepository, IAuditLogger auditLogger)
{
    public async Task<UpgradeUserToPremiumUseCaseOutput> ExecuteAsync(Guid userId)
    {
        var user = await userRepository.GetByIdAsync(userId);

        if (user is null)
            throw new UserNotFoundException();

        if (!user.IsPremium)
        {
            user.UpgradeToPremium();
            await userRepository.UpdateAsync(user);

            await auditLogger.LogAsync(
                user.Id,
                "UserUpgradedToPremium",
                "User",
                user.Id,
                "User upgraded to premium plan");
        }

        return new UpgradeUserToPremiumUseCaseOutput(user.Id, user.Name, user.Email, user.IsPremium);
    }
}

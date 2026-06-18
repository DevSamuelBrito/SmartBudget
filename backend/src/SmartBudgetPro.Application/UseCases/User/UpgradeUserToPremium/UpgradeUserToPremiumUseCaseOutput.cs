namespace SmartBudgetPro.Application.UseCases.User.UpgradeUserToPremium;

public record UpgradeUserToPremiumUseCaseOutput(
    Guid UserId,
    string Name,
    string Email,
    bool IsPremium
);

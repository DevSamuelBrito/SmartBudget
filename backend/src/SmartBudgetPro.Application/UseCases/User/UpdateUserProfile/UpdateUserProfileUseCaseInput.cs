namespace SmartBudgetPro.Application.UseCases.User.UpdateUserProfile;

public record UpdateUserProfileUseCaseInput(
    string Name,
    string Email
);
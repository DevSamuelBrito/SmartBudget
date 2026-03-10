namespace SmartBudgetPro.Application.UseCases.User.CreateUser;

public record CreateUserUseCaseOutput(
    Guid UserId,
    string Name,
    string Email
);  
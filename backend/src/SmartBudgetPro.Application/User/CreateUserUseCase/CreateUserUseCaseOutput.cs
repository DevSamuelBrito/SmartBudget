namespace SmartBudgetPro.Application.User.CreateUserUseCase;

public record CreateUserUseCaseOutput(
    Guid UserId,
    string Name,
    string Email
);  
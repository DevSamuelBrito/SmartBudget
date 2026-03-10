namespace SmartBudgetPro.Application.UseCases.User.CreateUserUseCase;

public record CreateUserUseCaseOutput(
    Guid UserId,
    string Name,
    string Email
);  
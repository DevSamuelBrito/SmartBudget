namespace SmartBudgetPro.Application.UseCases.User.CreateUser;

public record CreateUserUseCaseInput(
    string Name,
    string Email,
    string Password
);
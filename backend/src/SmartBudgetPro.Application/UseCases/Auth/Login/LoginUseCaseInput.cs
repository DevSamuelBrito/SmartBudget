namespace SmartBudgetPro.Application.UseCases.Auth.Login;

public record LoginUseCaseInput(
    string Email,
    string Password
);
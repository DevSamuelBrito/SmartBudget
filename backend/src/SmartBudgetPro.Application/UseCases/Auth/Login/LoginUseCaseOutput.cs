namespace SmartBudgetPro.Application.UseCases.Auth.Login;

public record LoginUseCaseOutput(
    string AccessToken,
    string TokenType,
    int ExpiresInSeconds,
    Guid UserId,
    string Name,
    string Email
);
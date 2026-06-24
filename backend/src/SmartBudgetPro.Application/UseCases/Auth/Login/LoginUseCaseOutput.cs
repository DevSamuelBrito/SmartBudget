namespace SmartBudgetPro.Application.UseCases.Auth.Login;

public record LoginUseCaseOutput(
    string AccessToken,
    string TokenType,
    int ExpiresInSeconds,
    string RefreshToken,
    Guid UserId,
    string Name,
    string Email
);

namespace SmartBudgetPro.Application.UseCases.Auth.RefreshToken;

public record RefreshTokenUseCaseOutput(
    string AccessToken,
    string TokenType,
    int ExpiresInSeconds,
    string RefreshToken
);

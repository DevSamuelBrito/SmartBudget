namespace SmartBudgetPro.Application.Common.Security;

public record JwtTokenResult(
    string AccessToken,
    int ExpiresInSeconds
);
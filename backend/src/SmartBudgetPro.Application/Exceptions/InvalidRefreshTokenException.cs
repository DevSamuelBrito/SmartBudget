using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class InvalidRefreshTokenException : BusinessUnauthorizedException
{
    public InvalidRefreshTokenException()
        : base("Invalid or expired refresh token.")
    {
    }
}

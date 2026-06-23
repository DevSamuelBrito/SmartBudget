using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class InvalidCredentialsException : BusinessUnauthorizedException
{
    public InvalidCredentialsException()
        : base("Invalid email or password.")
    {
    }
}

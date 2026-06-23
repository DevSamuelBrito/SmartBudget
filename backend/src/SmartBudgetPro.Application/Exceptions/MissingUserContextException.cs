using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class MissingUserContextException : BusinessUnauthorizedException
{
    public MissingUserContextException()
        : base("UserId is required.")
    {
    }
}

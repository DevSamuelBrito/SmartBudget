using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class InvalidBudgetPeriodException : BusinessBadRequestException
{
    public InvalidBudgetPeriodException(string message)
        : base(message)
    {
    }
}

using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class InvalidDashboardParameterException : BusinessBadRequestException
{
    public InvalidDashboardParameterException(string message)
        : base(message)
    {
    }
}

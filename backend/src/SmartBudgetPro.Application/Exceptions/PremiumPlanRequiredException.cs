using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class PremiumPlanRequiredException : BusinessUnauthorizedException
{
    public PremiumPlanRequiredException(string message = "A premium plan is required to use this feature.")
        : base(message)
    {
    }
}

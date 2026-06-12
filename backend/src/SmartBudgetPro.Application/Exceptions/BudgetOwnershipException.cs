using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class BudgetOwnershipException : BusinessUnauthorizedException
{
    public BudgetOwnershipException()
        : base("This budget does not belong to the authenticated user.")
    {
    }
}

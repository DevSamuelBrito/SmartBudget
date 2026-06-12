using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class FinancialTransactionOwnershipException : BusinessUnauthorizedException
{
    public FinancialTransactionOwnershipException(string message = "This transaction does not belong to this user.")
        : base(message)
    {
    }
}

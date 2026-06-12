using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class BudgetAlreadyExistsException : BusinessConflictException
{
    public BudgetAlreadyExistsException()
        : base("A budget already exists for this category and period.")
    {
    }
}

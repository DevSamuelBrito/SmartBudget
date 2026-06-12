using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class TransactionCategoryAlreadyExistsException : BusinessConflictException
{
    public TransactionCategoryAlreadyExistsException()
        : base("A category with the same name already exists for this user.")
    {
    }
}

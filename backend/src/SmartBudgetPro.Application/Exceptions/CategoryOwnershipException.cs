using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class CategoryOwnershipException : BusinessUnauthorizedException
{
    public CategoryOwnershipException(string message = "Category does not belong to this user.")
        : base(message)
    {
    }
}

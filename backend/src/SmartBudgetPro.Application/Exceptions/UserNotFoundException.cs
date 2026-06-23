using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class UserNotFoundException : BusinessNotFoundException
{
    public UserNotFoundException()
        : base("User not found.")
    {
    }
}

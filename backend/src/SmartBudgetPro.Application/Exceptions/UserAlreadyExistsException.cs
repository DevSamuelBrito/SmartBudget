using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class UserAlreadyExistsException : BusinessConflictException
{
    public UserAlreadyExistsException()
        : base("A user with the same email already exists.")
    {
    }
}

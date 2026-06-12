namespace SmartBudgetPro.Shared.Exceptions;

public class BusinessConflictException : BusinessException
{
    public BusinessConflictException(string message)
        : base(message, 409)
    {
    }
}

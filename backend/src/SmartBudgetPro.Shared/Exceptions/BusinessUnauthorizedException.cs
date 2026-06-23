namespace SmartBudgetPro.Shared.Exceptions;

public class BusinessUnauthorizedException : BusinessException
{
    public BusinessUnauthorizedException(string message)
        : base(message, 401)
    {
    }
}

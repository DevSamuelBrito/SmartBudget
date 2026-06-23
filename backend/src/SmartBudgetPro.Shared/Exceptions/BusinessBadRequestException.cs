namespace SmartBudgetPro.Shared.Exceptions;

public class BusinessBadRequestException : BusinessException
{
    public BusinessBadRequestException(string message)
        : base(message, 400)
    {
    }
}

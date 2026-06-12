namespace SmartBudgetPro.Shared.Exceptions;

public class BusinessNotFoundException : BusinessException
{
    public BusinessNotFoundException(string message)
        : base(message, 404)
    {
    }
}

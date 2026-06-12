namespace SmartBudgetPro.Shared.Exceptions;

public abstract class BusinessException : Exception
{
    protected BusinessException(string message, int statusCode)
        : base(message)
    {
        StatusCode = statusCode;
    }

    public int StatusCode { get; }
}

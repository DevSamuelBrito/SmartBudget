using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class FinancialTransactionNotFoundException : BusinessNotFoundException
{
    public FinancialTransactionNotFoundException()
        : base("Financial transaction not found.")
    {
    }
}

using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class BudgetNotFoundException : BusinessNotFoundException
{
    public BudgetNotFoundException()
        : base("Budget not found.")
    {
    }
}

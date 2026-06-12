using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class TransactionCategoryNotFoundException : BusinessNotFoundException
{
    public TransactionCategoryNotFoundException()
        : base("Transaction category not found.")
    {
    }
}

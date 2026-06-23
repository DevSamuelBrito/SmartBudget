using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.Exceptions;

public sealed class TransactionCategoryHasLinkedTransactionsException : BusinessConflictException
{
    public TransactionCategoryHasLinkedTransactionsException()
        : base("Esta categoria não pode ser excluída pois possui transações vinculadas. Remova ou reatribua as transações antes de excluir a categoria.")
    {
    }
}

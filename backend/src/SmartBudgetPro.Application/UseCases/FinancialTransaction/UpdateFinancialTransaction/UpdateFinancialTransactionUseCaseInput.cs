using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.FinancialTransaction.UpdateFinancialTransaction
{
    public record UpdateFinancialTransactionUseCaseInput
    (
        Guid UserId,
        decimal Amount,
        DateTime TransactionDate,
        FinancialTransactionType TransactionType,
        RecurrenceType Recurrence,
        string Description,
        Guid? TransactionCategoryId
    );

}

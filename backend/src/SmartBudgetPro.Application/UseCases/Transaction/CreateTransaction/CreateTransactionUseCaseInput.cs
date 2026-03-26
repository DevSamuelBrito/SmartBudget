using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction;

public record CreateTransactionUseCaseInput(
    Guid UserId,
    decimal Amount,
    DateTime TransactionDate,
    FinancialTransactionType TransactionType,
    RecurrenceType Recurrence,
    string Description,
    Guid? TransactionCategoryId
);

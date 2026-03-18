namespace SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory;

public record CreateTransactionCategoryUseCaseInput
(
    Guid UserId,
    string Name
);
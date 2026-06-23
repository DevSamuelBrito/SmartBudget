namespace SmartBudgetPro.Application.UseCases.Budget.CreateBudget;

public record CreateBudgetUseCaseInput(
    Guid UserId,
    Guid TransactionCategoryId,
    int Year,
    int Month,
    decimal LimitAmount
);
using SmartBudgetPro.Domain.Budgets;

namespace SmartBudgetPro.Application.Common.DTOs;

public record BudgetDto(
    Guid Id,
    Guid UserId,
    Guid TransactionCategoryId,
    int Year,
    int Month,
    decimal LimitAmount,
    decimal SpentAmount,
    BudgetStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
using SmartBudgetPro.Domain.Budgets;

namespace SmartBudgetPro.Application.Common.DTOs;

public record BudgetByPeriodDto(
    Guid Id,
    Guid TransactionCategoryId,
    string CategoryName,
    string CategoryIcon,
    decimal LimitAmount,
    decimal SpentAmount,
    decimal Percentage,
    BudgetStatus Status
);

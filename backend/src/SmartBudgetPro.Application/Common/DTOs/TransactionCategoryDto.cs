namespace SmartBudgetPro.Application.Common.DTOs;

public record TransactionCategoryDto(
    Guid Id,
    Guid UserId,
    string Name,
    string Icon,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

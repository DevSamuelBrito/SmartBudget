namespace SmartBudgetPro.Application.Common.DTOs;

public record TransactionCategoryDto(
    Guid Id,
    Guid UserId,
    string Name,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

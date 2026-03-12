namespace SmartBudgetPro.Application.Common;

public record UserDto(
    Guid Id,
    string Name,
    string Email
);
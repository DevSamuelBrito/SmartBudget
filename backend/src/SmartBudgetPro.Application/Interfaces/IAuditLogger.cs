namespace SmartBudgetPro.Application.Interfaces;

public interface IAuditLogger
{
    Task LogAsync(Guid userId, string action, string entityType, Guid? entityId = null, string? details = null);
}

using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Domain.AuditLogs;

public class AuditLog
{
    private const int MaxActionLength = 100;
    private const int MaxEntityTypeLength = 100;
    private const int MaxDetailsLength = 1000;

    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Action { get; private set; } = string.Empty;
    public string EntityType { get; private set; } = string.Empty;
    public Guid? EntityId { get; private set; }
    public string? Details { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private AuditLog() { } // For EF Core

    private AuditLog(Guid userId, string action, string entityType, Guid? entityId, string? details)
    {
        if (userId == Guid.Empty)
            throw new BusinessBadRequestException("Invalid userId.");

        if (string.IsNullOrWhiteSpace(action))
            throw new BusinessBadRequestException("Action is required.");

        if (action.Trim().Length > MaxActionLength)
            throw new BusinessBadRequestException($"Action must have at most {MaxActionLength} characters.");

        if (string.IsNullOrWhiteSpace(entityType))
            throw new BusinessBadRequestException("EntityType is required.");

        if (entityType.Trim().Length > MaxEntityTypeLength)
            throw new BusinessBadRequestException($"EntityType must have at most {MaxEntityTypeLength} characters.");

        var normalizedDetails = string.IsNullOrWhiteSpace(details) ? null : details.Trim();

        if (normalizedDetails is not null && normalizedDetails.Length > MaxDetailsLength)
            throw new BusinessBadRequestException($"Details must have at most {MaxDetailsLength} characters.");

        Id = Guid.NewGuid();
        UserId = userId;
        Action = action.Trim();
        EntityType = entityType.Trim();
        EntityId = entityId;
        Details = normalizedDetails;
        CreatedAt = DateTime.UtcNow;
    }

    public static AuditLog Create(Guid userId, string action, string entityType, Guid? entityId = null, string? details = null)
    {
        return new AuditLog(userId, action, entityType, entityId, details);
    }
}

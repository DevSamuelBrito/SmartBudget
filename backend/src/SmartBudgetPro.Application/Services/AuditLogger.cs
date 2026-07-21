using SmartBudgetPro.Application.Interfaces;
using DomainAuditLog = SmartBudgetPro.Domain.AuditLogs.AuditLog;

namespace SmartBudgetPro.Application.Services;

public class AuditLogger(IAuditLogRepository auditLogRepository) : IAuditLogger
{
    public async Task LogAsync(Guid userId, string action, string entityType, Guid? entityId = null, string? details = null)
    {
        var auditLog = DomainAuditLog.Create(userId, action, entityType, entityId, details);
        await auditLogRepository.AddAsync(auditLog);
    }
}

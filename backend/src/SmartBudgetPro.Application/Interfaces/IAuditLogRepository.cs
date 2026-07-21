namespace SmartBudgetPro.Application.Interfaces;

using SmartBudgetPro.Domain.AuditLogs;

public interface IAuditLogRepository
{
    Task AddAsync(AuditLog auditLog);
}

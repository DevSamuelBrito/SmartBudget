using SmartBudgetPro.Application.Interfaces;
using DomainAuditLog = SmartBudgetPro.Domain.AuditLogs.AuditLog;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories
{
    public class AuditLogRepository(AppDbContext context) : IAuditLogRepository
    {
        public async Task AddAsync(DomainAuditLog auditLog)
        {
            await context.AuditLogs.AddAsync(auditLog);
            await context.SaveChangesAsync();
        }
    }
}

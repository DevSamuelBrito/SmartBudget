using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Dashboard;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories;

public class UserDashboardConfigRepository(AppDbContext context) : IUserDashboardConfigRepository
{
    public async Task<IEnumerable<UserDashboardConfig>> GetByUserIdAsync(Guid userId)
    {
        return await context.UserDashboardConfigs
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Order)
            .ToListAsync();
    }

    public async Task SaveAsync(IEnumerable<UserDashboardConfig> configs)
    {
        var configList = configs.ToList();
        if (configList.Count == 0) return;

        var userId = configList[0].UserId;

        var existing = await context.UserDashboardConfigs
            .Where(c => c.UserId == userId)
            .ToListAsync();

        context.UserDashboardConfigs.RemoveRange(existing);
        await context.UserDashboardConfigs.AddRangeAsync(configList);
        await context.SaveChangesAsync();
    }
}

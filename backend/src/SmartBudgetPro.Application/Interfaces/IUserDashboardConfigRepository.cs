using SmartBudgetPro.Domain.Dashboard;

namespace SmartBudgetPro.Application.Interfaces;

public interface IUserDashboardConfigRepository
{
    Task<IEnumerable<UserDashboardConfig>> GetByUserIdAsync(Guid userId);
    Task SaveAsync(IEnumerable<UserDashboardConfig> configs);
}

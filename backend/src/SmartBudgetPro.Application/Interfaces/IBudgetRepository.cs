using SmartBudgetPro.Domain.Budgets;

namespace SmartBudgetPro.Application.Interfaces;

public interface IBudgetRepository
{
    Task<IEnumerable<Budget>> GetAllAsync();
    Task<Budget?> GetByIdAsync(Guid budgetId);
    Task<Budget?> GetByUserCategoryAndPeriodAsync(Guid userId, Guid transactionCategoryId, int year, int month);
    Task AddAsync(Budget budget);
    Task UpdateAsync(Budget budget);
    Task DeleteAsync(Guid budgetId);
}
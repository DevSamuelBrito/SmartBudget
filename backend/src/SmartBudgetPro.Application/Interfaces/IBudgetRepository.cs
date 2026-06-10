using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Application.Common.DTOs;

namespace SmartBudgetPro.Application.Interfaces;

public interface IBudgetRepository
{
    Task<IEnumerable<Budget>> GetAllAsync();
    Task<IEnumerable<Budget>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<BudgetByPeriodDto>> GetByPeriodAsync(int month, int year);
    Task<IEnumerable<BudgetByPeriodDto>> GetByPeriodAndUserAsync(Guid userId, int month, int year);
    Task<Budget?> GetByIdAsync(Guid budgetId);
    Task<Budget?> GetByUserCategoryAndPeriodAsync(Guid userId, Guid transactionCategoryId, int year, int month);
    Task AddAsync(Budget budget);
    Task UpdateAsync(Budget budget);
    Task DeleteAsync(Guid budgetId);
}
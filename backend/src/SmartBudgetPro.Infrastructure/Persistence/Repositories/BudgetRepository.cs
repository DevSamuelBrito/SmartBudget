using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Budgets;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories;

public class BudgetRepository(AppDbContext context) : IBudgetRepository
{
    public async Task<IEnumerable<Budget>> GetAllAsync()
    {
        return await context.Budgets.ToListAsync();
    }

    public async Task<IEnumerable<Budget>> GetByUserIdAsync(Guid userId)
    {
        return await context.Budgets
            .Where(b => b.UserId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<BudgetByPeriodDto>> GetByPeriodAsync(int month, int year)
    {
        return await context.Budgets
            .Where(b => b.Month == month && b.Year == year)
            .Join(
                context.TransactionCategories,
                budget => new { budget.TransactionCategoryId, budget.UserId },
                category => new { TransactionCategoryId = category.Id, category.UserId },
                (budget, category) => new BudgetByPeriodDto(
                    budget.Id,
                    budget.TransactionCategoryId,
                    category.Name,
                    category.Icon,
                    budget.LimitAmount,
                    budget.SpentAmount,
                    budget.LimitAmount == 0 ? 0 : (budget.SpentAmount / budget.LimitAmount) * 100m,
                    budget.Status))
            .ToListAsync();
    }

    public async Task<IEnumerable<BudgetByPeriodDto>> GetByPeriodAndUserAsync(Guid userId, int month, int year)
    {
        return await context.Budgets
            .Where(b => b.Month == month && b.Year == year && b.UserId == userId)
            .Join(
                context.TransactionCategories,
                budget => new { budget.TransactionCategoryId, budget.UserId },
                category => new { TransactionCategoryId = category.Id, category.UserId },
                (budget, category) => new BudgetByPeriodDto(
                    budget.Id,
                    budget.TransactionCategoryId,
                    category.Name,
                    category.Icon,
                    budget.LimitAmount,
                    budget.SpentAmount,
                    budget.LimitAmount == 0 ? 0 : (budget.SpentAmount / budget.LimitAmount) * 100m,
                    budget.Status))
            .ToListAsync();
    }

    public async Task<Budget?> GetByIdAsync(Guid budgetId)
    {
        return await context.Budgets.FindAsync(budgetId);
    }

    public async Task<Budget?> GetByUserCategoryAndPeriodAsync(Guid userId, Guid transactionCategoryId, int year, int month)
    {
        return await context.Budgets
            .Where(b => b.UserId == userId
                     && b.TransactionCategoryId == transactionCategoryId
                     && b.Year == year
                     && b.Month == month)
            .FirstOrDefaultAsync();
    }

    public async Task AddAsync(Budget budget)
    {
        await context.Budgets.AddAsync(budget);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Budget budget)
    {
        context.Budgets.Update(budget);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid budgetId)
    {
        await context.Budgets
            .Where(b => b.Id == budgetId)
            .ExecuteDeleteAsync();
    }
}
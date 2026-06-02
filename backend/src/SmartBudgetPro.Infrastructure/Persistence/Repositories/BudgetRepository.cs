using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Budgets;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories;

public class BudgetRepository(AppDbContext context) : IBudgetRepository
{
    public async Task<IEnumerable<Budget>> GetAllAsync()
    {
        return await context.Budgets.ToListAsync();
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
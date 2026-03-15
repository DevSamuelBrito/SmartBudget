using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories
{
    public class TransactionCategoryRepository(AppDbContext context) : ITransactionCategoryRepository
    {

        public async Task<IEnumerable<TransactionCategory>> GetAllAsync()
        {
            return await context.TransactionCategories.ToListAsync();
        }

        public async Task<TransactionCategory?> GetByIdAsync(Guid categoryId)
        {
            return await context.TransactionCategories.FirstOrDefaultAsync(c => c.Id == categoryId);
        }

        public async Task<IEnumerable<TransactionCategory>> GetByUserIdAsync(Guid userId)
        {
            return await context.TransactionCategories.Where(c => c.UserId == userId).ToListAsync();
        }

        public async Task AddAsync(TransactionCategory category)
        {
            await context.TransactionCategories.AddAsync(category);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TransactionCategory category)
        {
            context.TransactionCategories.Update(category);
            await context.SaveChangesAsync();
        }
        public async Task DeleteAsync(Guid categoryId)
        {
            var category = context.TransactionCategories.Find(categoryId);

            if (category is null)
                return;

            context.TransactionCategories.Remove(category);
            await context.SaveChangesAsync();
        }

    }
}

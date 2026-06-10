using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories
{
    public class FinancialTransactionRepository(AppDbContext context) : IFinancialTransactionRepository
    {
        public async Task AddAsync(FinancialTransaction transaction)
        {
            await context.FinancialTransactions.AddAsync(transaction);

            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<FinancialTransaction>> GetAllAsync()
        {
            return await context.FinancialTransactions.ToListAsync();
        }

        public async Task<IEnumerable<FinancialTransaction>> GetByUserIdAsync(Guid userId)
        {
            return await context.FinancialTransactions
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        public async Task<FinancialTransaction?> GetByIdAsync(Guid transactionId)
        {
            return await context.FinancialTransactions.FindAsync(transactionId);
        }

        public async Task UpdateAsync(FinancialTransaction transaction)
        {
            context.FinancialTransactions.Update(transaction);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid transactionId)
        {
            await context.FinancialTransactions
                .Where(transaction => transaction.Id == transactionId)
                .ExecuteDeleteAsync();
        }

        public async Task<decimal> GetTotalExpensesByCategoryAndPeriodAsync(Guid categoryId, int year, int month)
        {
            return await context.FinancialTransactions
                .Where(t => t.TransactionCategoryId == categoryId
                    && t.Type == FinancialTransactionType.Expense
                    && t.TransactionDate.Year == year
                    && t.TransactionDate.Month == month)
                .SumAsync(t => t.Amount);
        }
    }
}

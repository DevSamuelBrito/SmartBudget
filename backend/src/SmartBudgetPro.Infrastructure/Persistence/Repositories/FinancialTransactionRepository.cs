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

        public async Task<FinancialTransaction?> GetByIdAsync(Guid transactionId)
        {
            return await context.FinancialTransactions.FindAsync(transactionId);
        }

        public async Task UpdateAsync(FinancialTransaction transaction)
        {
            context.FinancialTransactions.Update(transaction);
            await context.SaveChangesAsync();
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories
{
    public class TransactionRepository(AppDbContext context) : ITransactionRepository
    {
        public async Task AddAsync(FinancialTransaction transaction)
        {
            await context.Transactions.AddAsync(transaction);

            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<FinancialTransaction>> GetAllAsync()
        {
            return await context.Transactions.ToListAsync();
        }

        public async Task<FinancialTransaction?> GetByIdAsync(Guid transactionId)
        {
            return await context.Transactions.FindAsync(transactionId);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Persistence.Repositories
{
    public class TransactionRepository(AppDbContext context) : ITransactionRepository
    {
        public async Task<IEnumerable<Transaction>> GetAllAsync()
        {
            return await context.Transactions.ToListAsync();
        }

        public async Task<Transaction?> GetByIdAsync(Guid transactionId)
        {
            return await context.Transactions.FindAsync(transactionId);
        }
    }
}

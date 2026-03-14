using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.Interfaces
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<Transaction>> GetAllAsync();
        Task<Transaction?> GetByIdAsync(Guid transactionId);
    }
}

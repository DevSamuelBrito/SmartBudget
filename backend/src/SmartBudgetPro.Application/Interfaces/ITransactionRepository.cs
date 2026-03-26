using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.Interfaces
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<FinancialTransaction>> GetAllAsync();
        Task<FinancialTransaction?> GetByIdAsync(Guid transactionId);
        Task AddAsync(FinancialTransaction transaction);
    }
}

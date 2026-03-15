namespace SmartBudgetPro.Application.Interfaces;

using SmartBudgetPro.Domain.Transactions;

public interface ITransactionCategoryRepository
{
    Task<TransactionCategory?> GetByIdAsync(Guid categoryId);
    Task<IEnumerable<TransactionCategory>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<TransactionCategory>> GetAllAsync();
    Task AddAsync(TransactionCategory category);
    Task UpdateAsync(TransactionCategory category);
    Task DeleteAsync(Guid categoryId);
}
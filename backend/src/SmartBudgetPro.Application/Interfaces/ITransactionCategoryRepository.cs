namespace SmartBudgetPro.Application.Interfaces;

using SmartBudgetPro.Domain.Transactions;

public interface ITransactionCategoryRepository
{
    Task<TransactionCategory?> GetByIdAsync(Guid categoryId);
    Task<IEnumerable<TransactionCategory>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<TransactionCategory>> GetByUserIdPagedAsync(Guid userId, int skip, int take, string? name = null, string? icon = null);
    Task<int> CountByUserIdAsync(Guid userId, string? name = null, string? icon = null);
    Task<TransactionCategory?> GetByNameAsync(Guid userId, string name);
    Task<IEnumerable<TransactionCategory>> GetAllAsync();
    Task AddAsync(TransactionCategory category);
    Task UpdateAsync(TransactionCategory category);
    Task DeleteAsync(Guid categoryId);
}
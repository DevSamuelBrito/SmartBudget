namespace SmartBudgetPro.Application.Interfaces;

using SmartBudgetPro.Domain;

public interface ITransactionCategoryRepository
{
    Task AddAsync(TransactionCategory category);
    Task UpdateAsync(TransactionCategory category);
    Task DeleteAsync(Guid categoryId);
    Task<TransactionCategory?> GetByIdAsync(Guid categoryId);
    Task<IEnumerable<TransactionCategory>> GetByUserIdAsync(Guid userId);
}

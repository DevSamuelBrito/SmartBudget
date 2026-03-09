namespace SmartBudgetPro.Application.Interfaces;

public interface ITransactionCategoryRepository
{
    Task AddAsync(TransactionCategory category);
    Task UpdateAsync(TransactionCategory category);
    Task DeleteAsync(Guid categoryId);
    Task<TransactionCategory?> GetByIdAsync(Guid categoryId);
    Task<IEnumerable<TransactionCategory>> GetByUserIdAsync(Guid userId);
}

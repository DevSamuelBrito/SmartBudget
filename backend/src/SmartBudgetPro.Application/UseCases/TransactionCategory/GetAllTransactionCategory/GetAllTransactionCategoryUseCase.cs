using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory
{
    public class GetAllTransactionCategoryUseCase(ITransactionCategoryRepository transactionCategoryRepository)
    {
        public async Task<IEnumerable<TransactionCategoryDto>> ExecuteAsync(Guid userId)
        {
            var categories = await transactionCategoryRepository.GetByUserIdAsync(userId);
            return categories.Select(c => new TransactionCategoryDto(
                c.Id,
                c.UserId,
                c.Name,
                c.Icon,
                c.CreatedAt,
                c.UpdatedAt
            ));
        }
    }
}

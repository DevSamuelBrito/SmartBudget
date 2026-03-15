using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory
{
    public class GetAllTransactionCategory(ITransactionCategoryRepository transactionCategoryRepository)
    {
        public async Task<IEnumerable<TransactionCategoryDto>> ExecuteAsync()
        {
            var categories = await transactionCategoryRepository.GetAllAsync();
            return categories.Select(c => new TransactionCategoryDto(
                c.Id,
                c.UserId,
                c.Name,
                c.CreatedAt,
                c.UpdatedAt
            ));
        }
    }
}

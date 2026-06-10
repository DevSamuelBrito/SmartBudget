using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.TransactionCategory.DeleteTransactionCategory
{
    public class DeleteTransactionCategoryUseCase(ITransactionCategoryRepository transactionCategoryRepository)
    {
        public async Task ExecuteAsync(Guid userId, DeleteTransactionCategoryUseCaseInput input)
        {
            var category = await transactionCategoryRepository.GetByIdAsync(input.id);

            if (category is null)
                throw new InvalidOperationException("Transaction category not found.");

            if (category.UserId != userId)
                throw new UnauthorizedAccessException("This category does not belong to the authenticated user.");

            await transactionCategoryRepository.DeleteAsync(input.id);
        }
    }
}

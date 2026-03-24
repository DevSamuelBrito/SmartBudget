using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.TransactionCategory.UpdateTransactionCategory
{
    public class UpdateTransactionCategoryUseCase(ITransactionCategoryRepository transactionCategoryRepository)
    {
        public async Task ExecuteAsync (UpdateTransactionCategoryUseCaseInput input)
        {
            var category = await transactionCategoryRepository.GetByIdAsync(input.Id);

            if (category == null)
                throw new InvalidOperationException("Transaction category not found.");

            category.Rename(input.Name);

            await transactionCategoryRepository.UpdateAsync(category);
        }
    }
}

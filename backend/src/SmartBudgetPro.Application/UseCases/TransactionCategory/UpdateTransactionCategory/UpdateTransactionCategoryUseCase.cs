using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.TransactionCategory.UpdateTransactionCategory
{
    public class UpdateTransactionCategoryUseCase(ITransactionCategoryRepository transactionCategoryRepository)
    {
        public async Task ExecuteAsync(UpdateTransactionCategoryUseCaseInput input)
        {
            var category = await transactionCategoryRepository.GetByIdAsync(input.Id);

            if (category == null)
                throw new InvalidOperationException("Transaction category not found.");

            var existingCategory = await transactionCategoryRepository.GetByNameAsync(category.UserId, input.Name);

            if (existingCategory is not null && existingCategory.Id != input.Id)
                throw new InvalidOperationException("A category with the same name already exists for this user.");


            category.Rename(input.Name);
            category.ChangeIcon(input.Icon);

            await transactionCategoryRepository.UpdateAsync(category);
        }
    }
}

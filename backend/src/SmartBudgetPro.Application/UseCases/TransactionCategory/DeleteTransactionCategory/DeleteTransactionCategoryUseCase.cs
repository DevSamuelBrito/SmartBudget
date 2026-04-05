using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.TransactionCategory.DeleteTransactionCategory
{
    public class DeleteTransactionCategoryUseCase(ITransactionCategoryRepository transactionCategoryRepository)
    {
        public async Task ExecuteAsync(DeleteTransactionCategoryUseCaseInput input)
        {
            await transactionCategoryRepository.DeleteAsync(input.id);
        }
    }
}

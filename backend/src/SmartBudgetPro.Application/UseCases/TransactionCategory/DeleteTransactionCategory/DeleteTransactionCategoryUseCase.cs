using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.TransactionCategory.DeleteTransactionCategory
{
    public class DeleteTransactionCategoryUseCase(
        ITransactionCategoryRepository transactionCategoryRepository,
        IFinancialTransactionRepository financialTransactionRepository)
    {
        public async Task ExecuteAsync(Guid userId, DeleteTransactionCategoryUseCaseInput input)
        {
            var category = await transactionCategoryRepository.GetByIdAsync(input.id);

            if (category is null)
                throw new InvalidOperationException("Transaction category not found.");

            if (category.UserId != userId)
                throw new UnauthorizedAccessException("This category does not belong to the authenticated user.");

            var hasLinkedTransactions = await financialTransactionRepository
                .ExistsTransactionByCategoryAsync(input.id);

            if (hasLinkedTransactions)
                throw new InvalidOperationException("Esta categoria não pode ser excluída pois possui transações vinculadas. Remova ou reatribua as transações antes de excluir a categoria.");

            await transactionCategoryRepository.DeleteAsync(input.id);
        }
    }
}

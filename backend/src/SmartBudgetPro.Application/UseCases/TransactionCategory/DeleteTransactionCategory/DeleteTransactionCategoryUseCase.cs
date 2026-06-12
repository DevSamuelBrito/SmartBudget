using SmartBudgetPro.Application.Exceptions;
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
                throw new TransactionCategoryNotFoundException();

            if (category.UserId != userId)
                throw new CategoryOwnershipException("This category does not belong to the authenticated user.");

            var hasLinkedTransactions = await financialTransactionRepository
                .ExistsTransactionByCategoryAsync(input.id);

            if (hasLinkedTransactions)
                throw new TransactionCategoryHasLinkedTransactionsException();

            await transactionCategoryRepository.DeleteAsync(input.id);
        }
    }
}

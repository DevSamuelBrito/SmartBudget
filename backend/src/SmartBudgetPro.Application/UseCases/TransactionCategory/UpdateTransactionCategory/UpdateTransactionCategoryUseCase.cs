using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.TransactionCategory.UpdateTransactionCategory
{
    public class UpdateTransactionCategoryUseCase(
        ITransactionCategoryRepository transactionCategoryRepository,
        IUserRepository userRepository,
        IAuditLogger auditLogger)
    {
        public async Task ExecuteAsync(Guid userId, UpdateTransactionCategoryUseCaseInput input)
        {
            var category = await transactionCategoryRepository.GetByIdAsync(input.Id);

            if (category == null)
                throw new TransactionCategoryNotFoundException();

            if (category.UserId != userId)
                throw new CategoryOwnershipException("This category does not belong to the authenticated user.");

            var user = await userRepository.GetByIdAsync(userId);

            if (user is null)
                throw new UserNotFoundException();

            if (!string.IsNullOrEmpty(input.Icon) && PremiumFeatures.Icons.Contains(input.Icon) && !user.IsPremium)
                throw new PremiumPlanRequiredException("Premium plan required to use this icon.");

            var existingCategory = await transactionCategoryRepository.GetByNameAsync(category.UserId, input.Name);

            if (existingCategory is not null && existingCategory.Id != input.Id)
                throw new TransactionCategoryAlreadyExistsException();


            category.Rename(input.Name);
            category.ChangeIcon(input.Icon);

            await transactionCategoryRepository.UpdateAsync(category);

            await auditLogger.LogAsync(
                userId,
                "CategoryUpdated",
                "TransactionCategory",
                category.Id,
                null);
        }
    }
}

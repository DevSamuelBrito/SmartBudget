using Microsoft.Extensions.Logging;
using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using DomainCategory = SmartBudgetPro.Domain.Transactions.TransactionCategory;


namespace SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory
{
    public class CreateTransactionCategoryUseCase(
        ITransactionCategoryRepository transactionCategoryRepository,
        IUserRepository userRepository,
        ILogger<CreateTransactionCategoryUseCase> logger,
        IAuditLogger auditLogger)
    {
        public async Task<TransactionCategoryDto> ExecuteAsync(CreateTransactionCategoryUseCaseInput input)
        {
            var user = await userRepository.GetByIdAsync(input.UserId);

            if (user is null)
                throw new UserNotFoundException();

            if (!string.IsNullOrEmpty(input.Icon) && PremiumFeatures.Icons.Contains(input.Icon) && !user.IsPremium)
            {
                logger.LogWarning(
                    "User {UserId} attempted to use premium icon {Icon} without a premium plan.",
                    input.UserId,
                    input.Icon);
                throw new PremiumPlanRequiredException("Premium plan required to use this icon.");
            }

            var existingCategory = await transactionCategoryRepository.GetByNameAsync(input.UserId, input.Name);

            if (existingCategory is not null)
                throw new TransactionCategoryAlreadyExistsException();

            var category = DomainCategory.Create(input.UserId, input.Name, input.Icon);

            await transactionCategoryRepository.AddAsync(category);

            await auditLogger.LogAsync(
                input.UserId,
                "CategoryCreated",
                "TransactionCategory",
                category.Id,
                null);

            return new TransactionCategoryDto(
                category.Id,
                category.UserId,
                category.Name,
                category.Icon,
                category.CreatedAt,
                category.UpdatedAt);
        }
    }
}

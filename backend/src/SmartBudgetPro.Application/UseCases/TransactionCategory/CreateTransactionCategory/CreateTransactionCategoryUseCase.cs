using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Interfaces;
using DomainCategory = SmartBudgetPro.Domain.Transactions.TransactionCategory;


namespace SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory
{
    public class CreateTransactionCategoryUseCase(ITransactionCategoryRepository transactionCategoryRepository, IUserRepository userRepository)
    {
        public async Task<TransactionCategoryDto> ExecuteAsync(CreateTransactionCategoryUseCaseInput input)
        {
            var user = await userRepository.GetByIdAsync(input.UserId);

            if (user is null)
                throw new InvalidOperationException("User not found.");

            var existingCategory = await transactionCategoryRepository.GetByNameAsync(input.UserId, input.Name);

            if (existingCategory is not null)
                throw new InvalidOperationException("A category with the same name already exists for this user.");

            var category = DomainCategory.Create(input.UserId, input.Name);

            await transactionCategoryRepository.AddAsync(category);

            return new TransactionCategoryDto(
                category.Id,
                category.UserId,
                category.Name,
                category.CreatedAt,
                category.UpdatedAt);
        }
    }
}

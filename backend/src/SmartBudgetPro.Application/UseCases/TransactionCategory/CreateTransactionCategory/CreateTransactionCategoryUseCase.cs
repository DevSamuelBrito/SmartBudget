using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Exceptions;
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
                throw new UserNotFoundException();

            var existingCategory = await transactionCategoryRepository.GetByNameAsync(input.UserId, input.Name);

            if (existingCategory is not null)
                throw new TransactionCategoryAlreadyExistsException();

            var category = DomainCategory.Create(input.UserId, input.Name, input.Icon);

            await transactionCategoryRepository.AddAsync(category);

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

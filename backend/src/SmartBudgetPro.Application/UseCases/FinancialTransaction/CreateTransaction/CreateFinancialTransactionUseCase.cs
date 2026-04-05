using SmartBudgetPro.Application.Interfaces;
using FluentValidation;
using DomainFinancialTransaction = SmartBudgetPro.Domain.Transactions.FinancialTransaction;

namespace SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction
{
    public class CreateFinancialTransactionUseCase(
        IFinancialTransactionRepository transactionRepository,
        IValidator<CreateFinancialTransactionUseCaseInput> validator,
        IUserRepository userRepository,
        ITransactionCategoryRepository transactionCategoryRepository
        )
    {
        public async Task<Guid> ExecuteAsync(CreateFinancialTransactionUseCaseInput input)
        {

            await validator.ValidateAndThrowAsync(input);

            var user = await userRepository.GetByIdAsync(input.UserId);

            if (user is null)
                throw new InvalidOperationException("User not found.");

            if (input.TransactionCategoryId.HasValue)
            {
                var category = await transactionCategoryRepository.GetByIdAsync(input.TransactionCategoryId.Value);

                if (category is null)
                    throw new InvalidOperationException("Category not found.");

                if (category.UserId != input.UserId)
                    throw new InvalidOperationException("Category does not belong to this user.");
            }

            var transaction = DomainFinancialTransaction.Create(
                userId: input.UserId,
                categoryId: input.TransactionCategoryId,
                amount: input.Amount,
                transactionDate: input.TransactionDate,
                type: input.TransactionType,
                description: input.Description,
                recurrence: input.Recurrence
            );

            await transactionRepository.AddAsync(transaction);

            return transaction.Id;

        }
    }
}

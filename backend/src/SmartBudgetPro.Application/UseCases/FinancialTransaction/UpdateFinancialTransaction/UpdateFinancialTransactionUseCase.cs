using FluentValidation;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.FinancialTransaction.UpdateFinancialTransaction
{
    public class UpdateFinancialTransactionUseCase(
        IFinancialTransactionRepository financialTransactionRepository,
        IUserRepository userRepository,
        ITransactionCategoryRepository transactionCategoryRepository,
        IValidator<UpdateFinancialTransactionUseCaseInput> validator)
    {
        public async Task ExecuteAsync(Guid id, UpdateFinancialTransactionUseCaseInput input)
        {
            await validator.ValidateAndThrowAsync(input);

            var financialTransaction = await financialTransactionRepository.GetByIdAsync(id);

            if (financialTransaction is null)
                throw new InvalidOperationException("Financial transaction not found.");

            var user = await userRepository.GetByIdAsync(input.UserId);

            if (user is null)
                throw new InvalidOperationException("User not found.");

            if (financialTransaction.UserId != input.UserId)
                throw new InvalidOperationException("This transaction does not belong to this user.");

            if (input.TransactionCategoryId.HasValue)
            {
                var category = await transactionCategoryRepository.GetByIdAsync(input.TransactionCategoryId.Value);

                if (category is null)
                    throw new InvalidOperationException("Category not found.");

                if (category.UserId != input.UserId)
                    throw new InvalidOperationException("Category does not belong to this user.");
            }

            financialTransaction.Update(
                categoryId: input.TransactionCategoryId,
                amount: input.Amount,
                transactionDate: input.TransactionDate,
                type: input.TransactionType,
                description: input.Description,
                recurrence: input.Recurrence
            );

            await financialTransactionRepository.UpdateAsync(financialTransaction);
        }
    }
}

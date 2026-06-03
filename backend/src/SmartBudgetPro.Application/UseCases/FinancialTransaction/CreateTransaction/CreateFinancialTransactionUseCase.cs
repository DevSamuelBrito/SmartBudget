using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Transactions;
using FluentValidation;
using DomainFinancialTransaction = SmartBudgetPro.Domain.Transactions.FinancialTransaction;

namespace SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction
{
    public class CreateFinancialTransactionUseCase(
        IFinancialTransactionRepository transactionRepository,
        IValidator<CreateFinancialTransactionUseCaseInput> validator,
        IUserRepository userRepository,
        ITransactionCategoryRepository transactionCategoryRepository,
        IBudgetRepository budgetRepository
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

            if (input.TransactionType == FinancialTransactionType.Expense && input.TransactionCategoryId.HasValue)
            {
                await RecalculateBudgetAsync(input.UserId, input.TransactionCategoryId.Value, input.TransactionDate.Year, input.TransactionDate.Month);
            }

            return transaction.Id;

        }

        private async Task RecalculateBudgetAsync(Guid userId, Guid categoryId, int year, int month)
        {
            var budget = await budgetRepository.GetByUserCategoryAndPeriodAsync(userId, categoryId, year, month);

            if (budget is null)
                return;

            var total = await transactionRepository.GetTotalExpensesByCategoryAndPeriodAsync(categoryId, year, month);

            budget.RecalculateFromExpenses(total);
            
            await budgetRepository.UpdateAsync(budget);
        }
    }
}

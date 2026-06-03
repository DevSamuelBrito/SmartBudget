using FluentValidation;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.FinancialTransaction.UpdateFinancialTransaction
{
    public class UpdateFinancialTransactionUseCase(
        IFinancialTransactionRepository financialTransactionRepository,
        IUserRepository userRepository,
        ITransactionCategoryRepository transactionCategoryRepository,
        IBudgetRepository budgetRepository,
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

            // Capture old values before update
            var oldType = financialTransaction.Type;
            var oldCategoryId = financialTransaction.TransactionCategoryId;
            var oldDate = financialTransaction.TransactionDate;

            financialTransaction.Update(
                categoryId: input.TransactionCategoryId,
                amount: input.Amount,
                transactionDate: input.TransactionDate,
                type: input.TransactionType,
                description: input.Description,
                recurrence: input.Recurrence
            );

            await financialTransactionRepository.UpdateAsync(financialTransaction);

            // Recalculate budget for old category/period if it was an expense
            if (oldType == FinancialTransactionType.Expense && oldCategoryId.HasValue)
            {
                await RecalculateBudgetAsync(input.UserId, oldCategoryId.Value, oldDate.Year, oldDate.Month);
            }

            // Recalculate budget for new category/period if it's an expense (skip if same category and period)
            if (input.TransactionType == FinancialTransactionType.Expense && input.TransactionCategoryId.HasValue)
            {
                var sameCategory = oldCategoryId == input.TransactionCategoryId;
                var samePeriod = oldDate.Year == input.TransactionDate.Year && oldDate.Month == input.TransactionDate.Month;

                if (!(sameCategory && samePeriod))
                {
                    await RecalculateBudgetAsync(input.UserId, input.TransactionCategoryId.Value, input.TransactionDate.Year, input.TransactionDate.Month);
                }
            }
        }

        private async Task RecalculateBudgetAsync(Guid userId, Guid categoryId, int year, int month)
        {
            var budget = await budgetRepository.GetByUserCategoryAndPeriodAsync(userId, categoryId, year, month);

            if (budget is null)
                return;

            var total = await financialTransactionRepository.GetTotalExpensesByCategoryAndPeriodAsync(categoryId, year, month);

            budget.RecalculateFromExpenses(total);
            
            await budgetRepository.UpdateAsync(budget);
        }
    }
}

using FluentValidation;
using SmartBudgetPro.Application.Exceptions;
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
                throw new FinancialTransactionNotFoundException();

            var user = await userRepository.GetByIdAsync(input.UserId);

            if (user is null)
                throw new UserNotFoundException();

            if (financialTransaction.UserId != input.UserId)
                throw new FinancialTransactionOwnershipException();

            if (input.TransactionCategoryId.HasValue)
            {
                var category = await transactionCategoryRepository.GetByIdAsync(input.TransactionCategoryId.Value);

                if (category is null)
                    throw new CategoryNotFoundException();

                if (category.UserId != input.UserId)
                    throw new CategoryOwnershipException();
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

            if (input.TransactionType == FinancialTransactionType.Expense && input.TransactionCategoryId.HasValue
                && ShouldRecalculateNewCategory(oldCategoryId, oldDate, input.TransactionCategoryId, input.TransactionDate))
            {
                await RecalculateBudgetAsync(input.UserId, input.TransactionCategoryId.Value, input.TransactionDate.Year, input.TransactionDate.Month);
            }
        }

        private static bool ShouldRecalculateNewCategory(Guid? oldCategoryId, DateTime oldDate, Guid? newCategoryId, DateTime newDate)
        {
            var sameCategory = oldCategoryId == newCategoryId;
            var samePeriod = oldDate.Year == newDate.Year && oldDate.Month == newDate.Month;
            return !(sameCategory && samePeriod);
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

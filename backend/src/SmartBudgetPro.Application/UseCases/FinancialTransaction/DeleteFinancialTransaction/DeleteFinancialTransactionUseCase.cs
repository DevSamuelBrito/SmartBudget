using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.FinancialTransaction.DeleteFinancialTransaction
{
    public class DeleteFinancialTransactionUseCase(
        IFinancialTransactionRepository financialTransactionRepository,
        IBudgetRepository budgetRepository)
    {
        public async Task ExecuteAsync(Guid userId, Guid transactionId)
        {
            var transaction = await financialTransactionRepository.GetByIdAsync(transactionId);

            if (transaction is null)
                throw new InvalidOperationException("Financial transaction not found.");

            if (transaction.UserId != userId)
                throw new UnauthorizedAccessException("This transaction does not belong to the authenticated user.");

            var wasExpense = transaction.Type == FinancialTransactionType.Expense;
            var categoryId = transaction.TransactionCategoryId;
            var year = transaction.TransactionDate.Year;
            var month = transaction.TransactionDate.Month;

            await financialTransactionRepository.DeleteAsync(transactionId);

            if (wasExpense && categoryId.HasValue)
            {
                var budget = await budgetRepository.GetByUserCategoryAndPeriodAsync(userId, categoryId.Value, year, month);

                if (budget is not null)
                {
                    var total = await financialTransactionRepository.GetTotalExpensesByCategoryAndPeriodAsync(categoryId.Value, year, month);
                    budget.RecalculateFromExpenses(total);
                    await budgetRepository.UpdateAsync(budget);
                }
            }
        }
    }
}
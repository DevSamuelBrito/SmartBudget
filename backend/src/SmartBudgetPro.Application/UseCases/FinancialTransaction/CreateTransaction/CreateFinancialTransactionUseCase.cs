using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Domain.Transactions;
using FluentValidation;
using Microsoft.Extensions.Logging;
using DomainFinancialTransaction = SmartBudgetPro.Domain.Transactions.FinancialTransaction;

namespace SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction
{
    public class CreateFinancialTransactionUseCase(
        IFinancialTransactionRepository transactionRepository,
        IValidator<CreateFinancialTransactionUseCaseInput> validator,
        IUserRepository userRepository,
        ITransactionCategoryRepository transactionCategoryRepository,
        IBudgetRepository budgetRepository,
        ILogger<CreateFinancialTransactionUseCase> logger
        )
    {
        public async Task<Guid> ExecuteAsync(CreateFinancialTransactionUseCaseInput input)
        {

            await validator.ValidateAndThrowAsync(input);

            var user = await userRepository.GetByIdAsync(input.UserId);

            if (user is null)
                throw new UserNotFoundException();

            if (input.TransactionCategoryId.HasValue)
            {
                var category = await transactionCategoryRepository.GetByIdAsync(input.TransactionCategoryId.Value);

                if (category is null)
                    throw new CategoryNotFoundException();

                if (category.UserId != input.UserId)
                    throw new CategoryOwnershipException();
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

            logger.LogInformation(
                "Transaction {TransactionId} of type {TransactionType} created for user {UserId}.",
                transaction.Id,
                input.TransactionType,
                input.UserId);

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

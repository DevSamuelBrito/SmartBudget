using SmartBudgetPro.Domain.Transactions;

using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction
{
    public class CreateFinancialTransactionUseCase(ITransactionRepository transactionRepository)
    {
        public async Task ExecuteAsync(CreateTransactionUseCaseInput input)
        {
            var transaction = FinancialTransaction.Create(
                userId: input.UserId,
                categoryId: input.TransactionCategoryId,
                amount: input.Amount,
                transactionDate: input.TransactionDate,
                type: input.TransactionType,
                description: input.Description,
                recurrence: input.Recurrence
            );

            await transactionRepository.AddAsync(transaction);

            return;

        }
    }
}

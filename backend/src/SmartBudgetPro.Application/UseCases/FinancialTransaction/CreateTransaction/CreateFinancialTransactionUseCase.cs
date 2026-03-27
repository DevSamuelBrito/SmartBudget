using SmartBudgetPro.Domain.Transactions;
using SmartBudgetPro.Application.Interfaces;
using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction
{
    public class CreateFinancialTransactionUseCase(ITransactionRepository transactionRepository, IValidator<CreateFinancialTransactionUseCaseInput> validator)
    {
        public async Task<Guid> ExecuteAsync(CreateFinancialTransactionUseCaseInput input)
        {

            await validator.ValidateAndThrowAsync(input);

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

            return transaction.Id;

        }
    }
}

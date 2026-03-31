using FluentValidation;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.FinancialTransaction.UpdateFinancialTransaction
{
    public class UpdateFinancialTransactionUseCaseInputValidator
        : AbstractValidator<UpdateFinancialTransactionUseCaseInput>
    {
        public UpdateFinancialTransactionUseCaseInputValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("UserId is required.");

            RuleFor(x => x.Amount)
                .GreaterThan(0)
                .WithMessage("Amount must be greater than zero.");

            RuleFor(x => x.TransactionDate)
                .NotEmpty()
                .WithMessage("TransactionDate is required.");

            RuleFor(x => x.TransactionType)
                .IsInEnum()
                .WithMessage("TransactionType is invalid.");

            RuleFor(x => x.Recurrence)
                .IsInEnum()
                .WithMessage("Recurrence is invalid.");

            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("Description is required.")
                .MaximumLength(200)
                .WithMessage("Description must be at most 200 characters long.");

            RuleFor(x => x.TransactionCategoryId)
                .NotNull()
                .When(x => x.TransactionType == FinancialTransactionType.Expense)
                .WithMessage("Category is required for expense transactions.");

            RuleFor(x => x.TransactionCategoryId)
                .Null()
                .When(x => x.TransactionType == FinancialTransactionType.Transfer)
                .WithMessage("Transfer transactions must not have category.");
        }
    }
}

using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction
{
    public class CreateFinancialTransactionInputValidator
     : AbstractValidator<CreateFinancialTransactionUseCaseInput>
    {
        public CreateFinancialTransactionInputValidator()
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
                .MaximumLength(255)
                .WithMessage("Description must be at most 255 characters long.");
        }
    }
}

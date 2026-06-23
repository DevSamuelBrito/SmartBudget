using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Budget.CreateBudget;

public class CreateBudgetUseCaseInputValidator : AbstractValidator<CreateBudgetUseCaseInput>
{
    public CreateBudgetUseCaseInputValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("UserId is required.");

        RuleFor(x => x.TransactionCategoryId)
            .NotEmpty()
            .WithMessage("TransactionCategoryId is required.");

        RuleFor(x => x.Year)
            .InclusiveBetween(2000, 2100)
            .WithMessage("Year must be between 2000 and 2100.");

        RuleFor(x => x.Month)
            .InclusiveBetween(1, 12)
            .WithMessage("Month must be between 1 and 12.");

        RuleFor(x => x.LimitAmount)
            .GreaterThan(0)
            .WithMessage("LimitAmount must be greater than zero.");
    }
}
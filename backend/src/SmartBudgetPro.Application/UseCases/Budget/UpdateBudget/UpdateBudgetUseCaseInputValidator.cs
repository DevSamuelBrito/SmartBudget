using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Budget.UpdateBudget;

public class UpdateBudgetUseCaseInputValidator : AbstractValidator<UpdateBudgetUseCaseInput>
{
    public UpdateBudgetUseCaseInputValidator()
    {
        RuleFor(x => x.LimitAmount)
            .GreaterThan(0)
            .WithMessage("LimitAmount must be greater than zero.");
    }
}
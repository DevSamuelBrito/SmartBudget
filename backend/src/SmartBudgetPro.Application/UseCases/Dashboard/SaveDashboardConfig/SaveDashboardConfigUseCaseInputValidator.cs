using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;

public class SaveDashboardConfigUseCaseInputValidator : AbstractValidator<SaveDashboardConfigUseCaseInput>
{
    public SaveDashboardConfigUseCaseInputValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("UserId is required.");

        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("At least one config item is required.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ComponentKey)
                .NotEmpty()
                .WithMessage("ComponentKey is required.");

            item.RuleFor(i => i.Order)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Order must be non-negative.");

            item.RuleFor(i => i.Columns)
                .Must(c => c is 1 or 2)
                .WithMessage("Columns must be 1 or 2.");
        });
    }
}

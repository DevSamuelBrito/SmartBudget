using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardConfig;

public class GetDashboardConfigUseCaseInputValidator : AbstractValidator<GetDashboardConfigUseCaseInput>
{
    public GetDashboardConfigUseCaseInputValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("UserId is required.");
    }
}

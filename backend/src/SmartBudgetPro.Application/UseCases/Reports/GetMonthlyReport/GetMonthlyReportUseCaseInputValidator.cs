using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Reports.GetMonthlyReport;

public class GetMonthlyReportUseCaseInputValidator : AbstractValidator<GetMonthlyReportUseCaseInput>
{
    public GetMonthlyReportUseCaseInputValidator()
    {
        RuleFor(input => input.UserId).NotEmpty();
        RuleFor(input => input.Month).InclusiveBetween(1, 12);
        RuleFor(input => input.Year).InclusiveBetween(2000, 2100);
        RuleFor(input => input.Locale).NotEmpty();
    }
}

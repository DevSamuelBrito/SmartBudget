using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Transaction.GetAllTransaction;

public class GetAllFinancialTransactionUseCaseInputValidator : AbstractValidator<GetAllFinancialTransactionUseCaseInput>
{
    public GetAllFinancialTransactionUseCaseInputValidator()
    {
        RuleFor(input => input.Page)
            .GreaterThan(0);

        RuleFor(input => input.PageSize)
            .GreaterThan(0)
            .LessThanOrEqualTo(100);

        RuleFor(input => input.Description)
            .MaximumLength(255)
            .When(input => input.Description is not null);

    }
}
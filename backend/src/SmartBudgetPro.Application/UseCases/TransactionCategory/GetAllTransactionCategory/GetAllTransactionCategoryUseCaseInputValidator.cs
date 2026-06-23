using FluentValidation;

namespace SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;

public class GetAllTransactionCategoryUseCaseInputValidator : AbstractValidator<GetAllTransactionCategoryUseCaseInput>
{
  public GetAllTransactionCategoryUseCaseInputValidator()
    {
        RuleFor(input => input.Page)
            .GreaterThan(0);

        RuleFor(input => input.PageSize)
            .GreaterThan(0)
            .LessThanOrEqualTo(100);

        RuleFor(input => input.Name)
            .MaximumLength(150)
            .When(input => input.Name is not null);

        RuleFor(input => input.Icon)
            .MaximumLength(50)
            .When(input => input.Icon is not null);
    }
}
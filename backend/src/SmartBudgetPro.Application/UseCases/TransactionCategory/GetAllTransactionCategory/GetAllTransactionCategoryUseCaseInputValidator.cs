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
    }
}
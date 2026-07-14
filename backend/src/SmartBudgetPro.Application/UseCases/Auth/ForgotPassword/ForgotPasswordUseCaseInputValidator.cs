using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Auth.ForgotPassword;

public class ForgotPasswordUseCaseInputValidator : AbstractValidator<ForgotPasswordUseCaseInput>
{
    public ForgotPasswordUseCaseInputValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.");
    }
}

using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Auth.ResetPassword;

public class ResetPasswordUseCaseInputValidator : AbstractValidator<ResetPasswordUseCaseInput>
{
    public ResetPasswordUseCaseInputValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.");

        RuleFor(x => x.ConfirmNewPassword)
            .NotEmpty().WithMessage("Password confirmation is required.")
            .Equal(x => x.NewPassword).WithMessage("Passwords do not match.");
    }
}

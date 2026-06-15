using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.User.ChangeUserPassword;

public class ChangeUserPasswordUseCaseInputValidator : AbstractValidator<ChangeUserPasswordUseCaseInput>
{
    public ChangeUserPasswordUseCaseInputValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(6).WithMessage("New password must have at least 6 characters.");

        RuleFor(x => x.ConfirmNewPassword)
            .NotEmpty().WithMessage("Confirm new password is required.")
            .Equal(x => x.NewPassword).WithMessage("Confirm new password must match new password.");
    }
}
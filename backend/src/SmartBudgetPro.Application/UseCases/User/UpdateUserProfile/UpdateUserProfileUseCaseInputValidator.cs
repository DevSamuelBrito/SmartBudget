using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.User.UpdateUserProfile;

public class UpdateUserProfileUseCaseInputValidator : AbstractValidator<UpdateUserProfileUseCaseInput>
{
    public UpdateUserProfileUseCaseInputValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MinimumLength(2).WithMessage("Name must have at least 2 characters.")
            .MaximumLength(150).WithMessage("Name must have at most 150 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email is invalid.")
            .MaximumLength(254).WithMessage("Email must have at most 254 characters.");
    }
}
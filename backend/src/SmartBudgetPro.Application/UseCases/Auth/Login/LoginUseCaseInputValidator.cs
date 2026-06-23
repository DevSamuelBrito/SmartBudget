using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Auth.Login;

public class LoginUseCaseInputValidator : AbstractValidator<LoginUseCaseInput>
{
    public LoginUseCaseInputValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required.");
    }
}
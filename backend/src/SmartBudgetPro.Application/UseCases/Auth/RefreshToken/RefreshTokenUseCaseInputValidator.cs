using FluentValidation;

namespace SmartBudgetPro.Application.UseCases.Auth.RefreshToken;

public class RefreshTokenUseCaseInputValidator : AbstractValidator<RefreshTokenUseCaseInput>
{
    public RefreshTokenUseCaseInputValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty()
            .WithMessage("Refresh token is required.");
    }
}

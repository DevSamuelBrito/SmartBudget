using FluentValidation;
using SmartBudgetPro.Application.Common.Settings;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Auth;

namespace SmartBudgetPro.Application.UseCases.Auth.ForgotPassword;

public class ForgotPasswordUseCase(
    IUserRepository userRepository,
    IPasswordResetTokenRepository passwordResetTokenRepository,
    IEmailService emailService,
    ForgotPasswordSettings settings,
    IValidator<ForgotPasswordUseCaseInput> validator)
{
    public async Task ExecuteAsync(ForgotPasswordUseCaseInput input)
    {
        if (string.IsNullOrEmpty(settings.FrontendUrl))
            throw new InvalidOperationException("FrontendUrl is not configured.");

        await validator.ValidateAndThrowAsync(input);

        var normalizedEmail = input.Email.Trim().ToLowerInvariant();
        var user = await userRepository.GetByEmailAsync(normalizedEmail);

        if (user is null)
            return;

        await passwordResetTokenRepository.InvalidateAllByUserIdAsync(user.Id);

        var resetToken = PasswordResetToken.Create(user.Id);
        await passwordResetTokenRepository.AddAsync(resetToken);

        var resetLink = $"{settings.FrontendUrl}/reset-password?token={resetToken.Token}";
        await emailService.SendPasswordResetEmailAsync(user.Email, user.Name, resetLink);
    }
}

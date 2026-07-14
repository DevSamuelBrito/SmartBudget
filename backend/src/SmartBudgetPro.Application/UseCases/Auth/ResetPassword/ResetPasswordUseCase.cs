using FluentValidation;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.UseCases.Auth.ResetPassword;

public class ResetPasswordUseCase(
    IPasswordResetTokenRepository passwordResetTokenRepository,
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IValidator<ResetPasswordUseCaseInput> validator)
{
    public async Task ExecuteAsync(ResetPasswordUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var resetToken = await passwordResetTokenRepository.GetByTokenAsync(input.Token);

        if (resetToken is null || !resetToken.IsValid)
            throw new BusinessBadRequestException("Invalid or expired password reset token.");

        var user = await userRepository.GetByIdAsync(resetToken.UserId);

        if (user is null)
            throw new BusinessBadRequestException("Invalid or expired password reset token.");

        var newPasswordHash = passwordHasher.Hash(input.NewPassword);
        user.ChangePasswordHash(newPasswordHash);
        await userRepository.UpdateAsync(user);

        await passwordResetTokenRepository.InvalidateAllByUserIdAsync(user.Id);
    }
}

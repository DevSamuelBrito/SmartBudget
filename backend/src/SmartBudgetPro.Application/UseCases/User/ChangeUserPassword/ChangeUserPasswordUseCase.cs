using FluentValidation;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Application.UseCases.User.ChangeUserPassword;

public class ChangeUserPasswordUseCase(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IValidator<ChangeUserPasswordUseCaseInput> validator)
{
    public async Task ExecuteAsync(Guid userId, ChangeUserPasswordUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var user = await userRepository.GetByIdAsync(userId);

        if (user is null)
            throw new UserNotFoundException();

        if (!passwordHasher.Verify(input.CurrentPassword, user.PasswordHash))
            throw new BusinessBadRequestException("Current password is incorrect.");

        var passwordHash = passwordHasher.Hash(input.NewPassword);

        user.ChangePasswordHash(passwordHash);

        await userRepository.UpdateAsync(user);
    }
}
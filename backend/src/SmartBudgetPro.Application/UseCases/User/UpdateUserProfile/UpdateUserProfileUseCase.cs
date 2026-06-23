using FluentValidation;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.User.UpdateUserProfile;

public class UpdateUserProfileUseCase(
    IUserRepository userRepository,
    IValidator<UpdateUserProfileUseCaseInput> validator)
{
    public async Task ExecuteAsync(Guid userId, UpdateUserProfileUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var user = await userRepository.GetByIdAsync(userId);

        if (user is null)
            throw new UserNotFoundException();

        var emailAlreadyInUse = await userRepository.EmailExistsAsync(input.Email, userId);

        if (emailAlreadyInUse)
            throw new UserAlreadyExistsException();

        user.Update(input.Name, input.Email);

        await userRepository.UpdateAsync(user);
    }
}
using FluentValidation;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Auth.Login;

public class LoginUseCase(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator,
    IValidator<LoginUseCaseInput> validator)
{
    public async Task<LoginUseCaseOutput> ExecuteAsync(LoginUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var normalizedEmail = input.Email.Trim().ToLowerInvariant();
        var user = await userRepository.GetByEmailAsync(normalizedEmail);

        if (user is null)
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!passwordHasher.Verify(input.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        var tokenResult = jwtTokenGenerator.Generate(user.Id, user.Email, user.Name);

        return new LoginUseCaseOutput(
            tokenResult.AccessToken,
            "Bearer",
            tokenResult.ExpiresInSeconds,
            user.Id,
            user.Name,
            user.Email);
    }
}
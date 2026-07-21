using FluentValidation;
using Microsoft.Extensions.Logging;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using DomainRefreshToken = SmartBudgetPro.Domain.Auth.RefreshToken;

namespace SmartBudgetPro.Application.UseCases.Auth.Login;

public class LoginUseCase(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator,
    IRefreshTokenRepository refreshTokenRepository,
    IValidator<LoginUseCaseInput> validator,
    ILogger<LoginUseCase> logger)
{
    public async Task<LoginUseCaseOutput> ExecuteAsync(LoginUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var normalizedEmail = input.Email.Trim().ToLowerInvariant();
        var user = await userRepository.GetByEmailAsync(normalizedEmail);

        if (user is null)
            throw new InvalidCredentialsException();

        if (!passwordHasher.Verify(input.Password, user.PasswordHash))
            throw new InvalidCredentialsException();

        var tokenResult = jwtTokenGenerator.Generate(user.Id, user.Email, user.Name, user.IsPremium);

        var refreshToken = DomainRefreshToken.Create(user.Id);
        await refreshTokenRepository.AddAsync(refreshToken);

        logger.LogInformation("User {UserId} logged in successfully.", user.Id);

        return new LoginUseCaseOutput(
            tokenResult.AccessToken,
            "Bearer",
            tokenResult.ExpiresInSeconds,
            refreshToken.Token,
            user.Id,
            user.Name,
            user.Email);
    }
}

using FluentValidation;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using DomainRefreshToken = SmartBudgetPro.Domain.Auth.RefreshToken;

namespace SmartBudgetPro.Application.UseCases.Auth.RefreshToken;

public class RefreshTokenUseCase(
    IRefreshTokenRepository refreshTokenRepository,
    IUserRepository userRepository,
    IJwtTokenGenerator jwtTokenGenerator,
    IValidator<RefreshTokenUseCaseInput> validator)
{
    public async Task<RefreshTokenUseCaseOutput> ExecuteAsync(RefreshTokenUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var existingToken = await refreshTokenRepository.GetByTokenAsync(input.RefreshToken);

        if (existingToken is null || !existingToken.IsValid)
            throw new InvalidRefreshTokenException();

        var user = await userRepository.GetByIdAsync(existingToken.UserId);

        if (user is null)
            throw new InvalidRefreshTokenException();

        existingToken.Revoke();
        await refreshTokenRepository.UpdateAsync(existingToken);

        var newRefreshToken = DomainRefreshToken.Create(user.Id);
        await refreshTokenRepository.AddAsync(newRefreshToken);

        var tokenResult = jwtTokenGenerator.Generate(user.Id, user.Email, user.Name, user.IsPremium);

        return new RefreshTokenUseCaseOutput(
            tokenResult.AccessToken,
            "Bearer",
            tokenResult.ExpiresInSeconds,
            newRefreshToken.Token);
    }
}

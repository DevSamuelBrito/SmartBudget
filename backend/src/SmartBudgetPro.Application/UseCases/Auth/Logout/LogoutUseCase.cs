using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Auth.Logout;

public class LogoutUseCase(IRefreshTokenRepository refreshTokenRepository)
{
    public async Task ExecuteAsync(LogoutUseCaseInput input)
    {
        await refreshTokenRepository.RevokeAllByUserIdAsync(input.UserId);
    }
}

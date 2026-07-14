using SmartBudgetPro.Domain.Auth;

namespace SmartBudgetPro.Application.Interfaces;

public interface IRefreshTokenRepository
{
    Task AddAsync(RefreshToken refreshToken);
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task RevokeAllByUserIdAsync(Guid userId);
    Task UpdateAsync(RefreshToken refreshToken);
}

using SmartBudgetPro.Domain.Auth;

namespace SmartBudgetPro.Application.Interfaces;

public interface IPasswordResetTokenRepository
{
    Task AddAsync(PasswordResetToken token);
    Task<PasswordResetToken?> GetByTokenAsync(string token);
    Task InvalidateAllByUserIdAsync(Guid userId);
}

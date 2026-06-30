using System.Security.Cryptography;

namespace SmartBudgetPro.Domain.Auth;

public class PasswordResetToken
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Token { get; private set; } = string.Empty;
    public DateTime ExpiresAt { get; private set; }
    public bool IsUsed { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public bool IsValid => !IsUsed && DateTime.UtcNow < ExpiresAt;

    private PasswordResetToken() { } // For EF Core

    private PasswordResetToken(Guid userId, string token, DateTime expiresAt)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Token = token;
        ExpiresAt = expiresAt;
        IsUsed = false;
        CreatedAt = DateTime.UtcNow;
    }

    public static PasswordResetToken Create(Guid userId)
    {
        var tokenBytes = RandomNumberGenerator.GetBytes(32);
        var token = Convert.ToHexString(tokenBytes).ToLowerInvariant();
        var expiresAt = DateTime.UtcNow.AddMinutes(30);
        return new PasswordResetToken(userId, token, expiresAt);
    }

    public void MarkAsUsed()
    {
        IsUsed = true;
    }
}

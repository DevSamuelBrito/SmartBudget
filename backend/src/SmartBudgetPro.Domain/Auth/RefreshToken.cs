using System.Text.Json.Serialization;

namespace SmartBudgetPro.Domain.Auth;

public class RefreshToken
{
    [JsonInclude]
    public Guid Id { get; private set; }
    [JsonInclude]
    public Guid UserId { get; private set; }
    [JsonInclude]
    public string Token { get; private set; } = string.Empty;
    [JsonInclude]
    public DateTime ExpiresAt { get; private set; }
    [JsonInclude]
    public bool IsRevoked { get; private set; }
    [JsonInclude]
    public DateTime CreatedAt { get; private set; }

    public bool IsExpired => DateTime.UtcNow > ExpiresAt;
    public bool IsValid => !IsRevoked && !IsExpired;

    [JsonConstructor]
    private RefreshToken() { } // For EF Core and JSON deserialization

    private RefreshToken(Guid userId, string token, DateTime expiresAt)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Token = token;
        ExpiresAt = expiresAt;
        IsRevoked = false;
        CreatedAt = DateTime.UtcNow;
    }

    public static RefreshToken Create(Guid userId, int expiresInDays = 7)
    {
        var token = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(64));
        var expiresAt = DateTime.UtcNow.AddDays(expiresInDays);
        return new RefreshToken(userId, token, expiresAt);
    }

    public void Revoke()
    {
        IsRevoked = true;
    }
}

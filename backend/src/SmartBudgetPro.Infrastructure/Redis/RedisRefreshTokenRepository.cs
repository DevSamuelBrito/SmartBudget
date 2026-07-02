using System.Text.Json;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Auth;
using StackExchange.Redis;

namespace SmartBudgetPro.Infrastructure.Redis;

public class RedisRefreshTokenRepository(RedisConnection redisConnection) : IRefreshTokenRepository
{
    private static readonly TimeSpan TokenTtl = TimeSpan.FromDays(7);

    private IDatabase Database => redisConnection.GetDatabase();

    private static string TokenKey(string token) => $"refresh-token:{token}";
    private static string UserTokensKey(Guid userId) => $"user-refresh-tokens:{userId}";

    public async Task AddAsync(RefreshToken refreshToken)
    {
        var tokenKey = TokenKey(refreshToken.Token);
        var userTokensKey = UserTokensKey(refreshToken.UserId);
        var json = JsonSerializer.Serialize(refreshToken);

        await Database.StringSetAsync(tokenKey, json);
        await Database.KeyExpireAsync(tokenKey, TokenTtl);

        await Database.SetAddAsync(userTokensKey, refreshToken.Token);
        await Database.KeyExpireAsync(userTokensKey, TokenTtl);
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        var json = await Database.StringGetAsync(TokenKey(token));

        if (json.IsNullOrEmpty)
            return null;

        return JsonSerializer.Deserialize<RefreshToken>((string)json!);
    }

    public async Task RevokeAllByUserIdAsync(Guid userId)
    {
        var userTokensKey = UserTokensKey(userId);
        var tokens = await Database.SetMembersAsync(userTokensKey);

        foreach (var token in tokens)
        {
            await Database.KeyDeleteAsync(TokenKey(token!));
        }

        await Database.KeyDeleteAsync(userTokensKey);
    }

    public async Task UpdateAsync(RefreshToken refreshToken)
    {
        var tokenKey = TokenKey(refreshToken.Token);
        var ttl = await Database.KeyTimeToLiveAsync(tokenKey);
        var json = JsonSerializer.Serialize(refreshToken);

        await Database.StringSetAsync(tokenKey, json, ttl, When.Always);
    }
}

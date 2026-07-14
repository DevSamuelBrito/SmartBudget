using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace SmartBudgetPro.Infrastructure.Redis;

public class RedisConnection
{
    public IConnectionMultiplexer Multiplexer { get; }

    public RedisConnection(IConfiguration configuration)
    {
        var connectionString = configuration["Redis:ConnectionString"];

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("Redis:ConnectionString is not configured.");

        Multiplexer = ConnectionMultiplexer.Connect(connectionString);
    }

    public IDatabase GetDatabase() => Multiplexer.GetDatabase();
}

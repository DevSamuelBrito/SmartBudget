namespace SmartBudgetPro.API.Configuration;

public static class CorsExtensions
{
    public const string DefaultPolicyName = "Default";

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(DefaultPolicyName, policy =>
            {
                policy.WithOrigins(
                        "http://localhost:3000",
                        "https://smartbudget-production.vercel.app",
                        "https://smartbudget-app.com",
                        "https://www.smartbudget-app.com"
                       )
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        return services;
    }
}

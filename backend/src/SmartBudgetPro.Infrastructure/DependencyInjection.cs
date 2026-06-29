using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartBudgetPro.Application.Common.Settings;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Infrastructure.Email;
using SmartBudgetPro.Infrastructure.Persistence;
using SmartBudgetPro.Infrastructure.Persistence.Repositories;
using SmartBudgetPro.Infrastructure.Security;

namespace SmartBudgetPro.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        //persistence
        services.AddDbContext<AppDbContext>(options =>
         options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IFinancialTransactionRepository, FinancialTransactionRepository>();
        services.AddScoped<ITransactionCategoryRepository, TransactionCategoryRepository>();
        services.AddScoped<IBudgetRepository, BudgetRepository>();
        services.AddScoped<IUserDashboardConfigRepository, UserDashboardConfigRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();

        // Security
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddJwtAuthentication(configuration);
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        // Email
        services.AddHttpClient<IEmailService, BrevoEmailService>();

        // Settings
        services.AddSingleton(new ForgotPasswordSettings
        {
            FrontendUrl = configuration["FrontendUrl"] ?? "http://localhost:3000"
        });

        return services;
    }
}

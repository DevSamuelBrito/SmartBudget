using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Infrastructure.Persistence;
using SmartBudgetPro.Infrastructure.Persistence.Repositories;
using SmartBudgetPro.Infrastructure.Security;

namespace SmartBudgetPro.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
         options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITransactionRepository, FinancialTransactionRepository>();
        services.AddScoped<ITransactionCategoryRepository, TransactionCategoryRepository>();

        return services;
    }
}

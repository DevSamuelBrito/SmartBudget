using Microsoft.Extensions.DependencyInjection;
using SmartBudgetPro.Application.UseCases.User.CreateUser;

namespace SmartBudgetPro.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<CreateUserUseCase>();

        return services;
    }
}
using Microsoft.Extensions.DependencyInjection;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.GetAllUsers;

namespace SmartBudgetPro.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<GetAllUsersUseCase>();
        services.AddScoped<CreateUserUseCase>();

        return services;
    }
}
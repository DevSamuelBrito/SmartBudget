using Microsoft.Extensions.DependencyInjection;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.GetAllUsers;
using SmartBudgetPro.Application.UseCases.User.GetUserByID;

namespace SmartBudgetPro.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<GetAllUsersUseCase>();
        services.AddScoped<GetUserByIDUseCase>();
        services.AddScoped<CreateUserUseCase>();

        return services;
    }
}
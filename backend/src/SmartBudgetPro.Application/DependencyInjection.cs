using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;
using SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction;
using SmartBudgetPro.Application.UseCases.Transaction.GetAllTransaction;
using SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.DeleteTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.UpdateTransactionCategory;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.DeleteUser;
using SmartBudgetPro.Application.UseCases.User.GetAllUsers;
using SmartBudgetPro.Application.UseCases.User.GetUserByID;
using SmartBudgetPro.Application.UseCases.User.UpdateUser;

namespace SmartBudgetPro.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        //user
        services.AddScoped<GetAllUsersUseCase>();
        services.AddScoped<GetUserByIDUseCase>();
        services.AddScoped<CreateUserUseCase>();
        services.AddScoped<UpdateUserUseCase>();
        services.AddScoped<DeleteUserUseCase>();

        //financial transaction
        services.AddScoped<GetAllFinancialTransactionUseCase>();
        services.AddScoped<CreateFinancialTransactionUseCase>();

        //validators financial transaction
        services.AddValidatorsFromAssemblyContaining<CreateTransactionInputValidator>();

        //transaction Category
        services.AddScoped<GetAllTransactionCategoryUseCase>();
        services.AddScoped<CreateTransactionCategoryUseCase>();
        services.AddScoped<UpdateTransactionCategoryUseCase>();
        services.AddScoped<DeleteTransactionCategoryUseCase>();

        return services;
    }
}
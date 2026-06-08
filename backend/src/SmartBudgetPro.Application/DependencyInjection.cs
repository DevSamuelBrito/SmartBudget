using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SmartBudgetPro.Application.UseCases.Budget.CreateBudget;
using SmartBudgetPro.Application.UseCases.Budget.DeleteBudget;
using SmartBudgetPro.Application.UseCases.Budget.GetAllBudget;
using SmartBudgetPro.Application.UseCases.Budget.GetBudgetByID;
using SmartBudgetPro.Application.UseCases.Budget.GetBudgetsByPeriod;
using SmartBudgetPro.Application.UseCases.Budget.UpdateBudget;
using SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardConfig;
using SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;
using SmartBudgetPro.Application.UseCases.FinancialTransaction.DeleteFinancialTransaction;
using SmartBudgetPro.Application.UseCases.FinancialTransaction.UpdateFinancialTransaction;
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
        services.AddScoped<DeleteFinancialTransactionUseCase>();
        services.AddScoped<UpdateFinancialTransactionUseCase>();

        //validators financial transaction
        services.AddValidatorsFromAssemblyContaining<CreateFinancialTransactionInputValidator>();

        //transaction Category
        services.AddScoped<GetAllTransactionCategoryUseCase>();
        services.AddScoped<CreateTransactionCategoryUseCase>();
        services.AddScoped<UpdateTransactionCategoryUseCase>();
        services.AddScoped<DeleteTransactionCategoryUseCase>();

        //budget
        services.AddScoped<GetAllBudgetUseCase>();
        services.AddScoped<GetBudgetByIDUseCase>();
        services.AddScoped<GetBudgetsByPeriodUseCase>();
        services.AddScoped<CreateBudgetUseCase>();
        services.AddScoped<UpdateBudgetUseCase>();
        services.AddScoped<DeleteBudgetUseCase>();

        //dashboard
        services.AddScoped<GetDashboardOverviewUseCase>();
        services.AddScoped<GetDashboardConfigUseCase>();
        services.AddScoped<SaveDashboardConfigUseCase>();

        return services;
    }
}
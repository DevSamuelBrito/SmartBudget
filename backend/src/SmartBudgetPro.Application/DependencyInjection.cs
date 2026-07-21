using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.Services;
using SmartBudgetPro.Application.UseCases.Budget.CreateBudget;
using SmartBudgetPro.Application.UseCases.Budget.DeleteBudget;
using SmartBudgetPro.Application.UseCases.Budget.GetAllBudget;
using SmartBudgetPro.Application.UseCases.Budget.GetBudgetByID;
using SmartBudgetPro.Application.UseCases.Budget.GetBudgetsByPeriod;
using SmartBudgetPro.Application.UseCases.Budget.UpdateBudget;
using SmartBudgetPro.Application.UseCases.Auth.Login;
using SmartBudgetPro.Application.UseCases.Auth.RefreshToken;
using SmartBudgetPro.Application.UseCases.Auth.Logout;
using SmartBudgetPro.Application.UseCases.Auth.ForgotPassword;
using SmartBudgetPro.Application.UseCases.Auth.ResetPassword;
using SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardConfig;
using SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;
using SmartBudgetPro.Application.UseCases.FinancialTransaction.DeleteFinancialTransaction;
using SmartBudgetPro.Application.UseCases.FinancialTransaction.UpdateFinancialTransaction;
using SmartBudgetPro.Application.UseCases.Reports.GetMonthlyReport;
using SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction;
using SmartBudgetPro.Application.UseCases.Transaction.GetAllTransaction;
using SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.DeleteTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.UpdateTransactionCategory;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Application.UseCases.User.DeleteUser;
using SmartBudgetPro.Application.UseCases.User.ChangeUserPassword;
using SmartBudgetPro.Application.UseCases.User.UpdateUser;
using SmartBudgetPro.Application.UseCases.User.UpdateUserProfile;
using SmartBudgetPro.Application.UseCases.User.UpgradeUserToPremium;

namespace SmartBudgetPro.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        //audit log
        services.AddScoped<IAuditLogger, AuditLogger>();

        //user
        services.AddScoped<CreateUserUseCase>();
        services.AddScoped<UpdateUserUseCase>();
        services.AddScoped<DeleteUserUseCase>();
        services.AddScoped<UpdateUserProfileUseCase>();
        services.AddScoped<ChangeUserPasswordUseCase>();
        services.AddScoped<UpgradeUserToPremiumUseCase>();

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

        //reports
        services.AddScoped<GetMonthlyReportUseCase>();

        //auth
        services.AddScoped<LoginUseCase>();
        services.AddScoped<RefreshTokenUseCase>();
        services.AddScoped<LogoutUseCase>();
        services.AddScoped<ForgotPasswordUseCase>();
        services.AddScoped<ResetPasswordUseCase>();
        services.AddValidatorsFromAssemblyContaining<RefreshTokenUseCaseInputValidator>();

        return services;
    }
}
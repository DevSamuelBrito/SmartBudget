using Microsoft.EntityFrameworkCore;
using Serilog;
using SmartBudgetPro.API.Configuration;
using SmartBudgetPro.API.Middlewares;
using SmartBudgetPro.Application;
using SmartBudgetPro.Infrastructure;
using SmartBudgetPro.Infrastructure.Jobs;
using SmartBudgetPro.Infrastructure.Persistence;
using SmartBudgetPro.Infrastructure.Seed;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.ConfigureSerilog();

    builder.Services.AddApiDocumentation();
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);
    builder.Services.AddHostedService<RecurringTransactionJob>();

    builder.Services.AddApiVersioningSupport();
    builder.Services.AddControllers(options => options.AddVersionedApiConvention());
    builder.Services.AddProblemDetails();

    builder.Services.AddCorsPolicy();

    var app = builder.Build();

    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await dbContext.Database.MigrateAsync();

        if (app.Environment.IsDevelopment())
        {
            var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
            await seeder.SeedAsync();
        }
    }

    if (app.Environment.IsDevelopment())
    {
        app.MapApiDocumentation();
    }

    app.UseSerilogRequestLogging();
    app.UseCors(CorsExtensions.DefaultPolicyName);
    app.UseHttpsRedirection();
    app.UseMiddleware<ExceptionHandlingMiddleware>();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.Budget.CreateBudget;
using SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory;
using SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction;
using SmartBudgetPro.Application.UseCases.User.CreateUser;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Seed;

public class DatabaseSeeder(IServiceScopeFactory serviceScopeFactory, ILogger<DatabaseSeeder> logger)
{
    private const string DemoUserName = "Usuário Demo";
    private const string DemoUserEmail = "demo@smartbudget.com";
    private const string DemoUserPassword = "Demo@123456";

    private static readonly (string Name, string Icon)[] CategoryDefinitions =
    [
        ("Alimentação", "Utensils"),
        ("Transporte", "Car"),
        ("Moradia", "Home"),
        ("Lazer", "Gamepad2"),
        ("Saúde", "HeartPulse"),
        ("Educação", "GraduationCap"),
        ("Contas", "Receipt"),
        ("Compras", "ShoppingBag"),
    ];

    private static readonly (string CategoryName, decimal Limit)[] BudgetDefinitions =
    [
        ("Alimentação", 500m),
        ("Transporte", 300m),
        ("Moradia", 1000m),
        ("Lazer", 200m),
    ];

    private static readonly (string CategoryName, string Description, decimal Amount, int Day)[] RecurringExpenseDefinitions =
    [
        ("Moradia", "Aluguel", 900m, 5),
        ("Contas", "Internet", 120m, 10),
        ("Saúde", "Mensalidade academia", 130m, 8),
        ("Contas", "Plano de celular", 80m, 12),
        ("Lazer", "Assinatura streaming", 55m, 13),
    ];

    private static readonly (string CategoryName, string Description, decimal Amount, int MonthsAgo, int Day)[] RandomExpenseDefinitions =
    [
        ("Alimentação", "Supermercado", 380m, 0, 3),
        ("Alimentação", "Restaurante", 95m, 0, 11),
        ("Alimentação", "Delivery iFood", 62m, 1, 9),
        ("Transporte", "Uber", 45m, 0, 7),
        ("Transporte", "Gasolina", 180m, 1, 15),
        ("Moradia", "Condomínio", 280m, 0, 6),
        ("Moradia", "Manutenção residencial", 150m, 2, 20),
        ("Lazer", "Cinema", 60m, 1, 24),
        ("Lazer", "Show", 220m, 2, 11),
        ("Saúde", "Farmácia", 75m, 0, 9),
        ("Saúde", "Consulta médica", 250m, 2, 5),
        ("Educação", "Curso online", 199m, 1, 2),
        ("Educação", "Livros", 89m, 2, 27),
        ("Contas", "Conta de luz", 210m, 0, 8),
        ("Contas", "Conta de água", 95m, 1, 15),
        ("Compras", "Roupas", 260m, 0, 10),
        ("Compras", "Eletrônicos", 450m, 2, 13),
    ];

    public async Task SeedAsync()
    {
        using var scope = serviceScopeFactory.CreateScope();
        var provider = scope.ServiceProvider;

        var userRepository = provider.GetRequiredService<IUserRepository>();
        var existingUser = await userRepository.GetByEmailAsync(DemoUserEmail);

        if (existingUser is not null)
        {
            logger.LogInformation("Demo user already exists. Skipping database seed.");
            return;
        }

        logger.LogInformation("Seeding demo data for {Email}...", DemoUserEmail);

        var createUserUseCase = provider.GetRequiredService<CreateUserUseCase>();
        var createCategoryUseCase = provider.GetRequiredService<CreateTransactionCategoryUseCase>();
        var createBudgetUseCase = provider.GetRequiredService<CreateBudgetUseCase>();
        var createTransactionUseCase = provider.GetRequiredService<CreateFinancialTransactionUseCase>();

        var user = await createUserUseCase.ExecuteAsync(
            new CreateUserUseCaseInput(DemoUserName, DemoUserEmail, DemoUserPassword));

        var categories = await SeedCategoriesAsync(createCategoryUseCase, user.Id);

        await SeedBudgetsAsync(createBudgetUseCase, user.Id, categories);
        await SeedIncomeAsync(createTransactionUseCase, user.Id);
        await SeedRecurringExpensesAsync(createTransactionUseCase, user.Id, categories);
        await SeedRandomExpensesAsync(createTransactionUseCase, user.Id, categories);

        logger.LogInformation("Database seed completed.");
    }

    private static async Task<Dictionary<string, Guid>> SeedCategoriesAsync(
        CreateTransactionCategoryUseCase useCase, Guid userId)
    {
        var categories = new Dictionary<string, Guid>();

        foreach (var (name, icon) in CategoryDefinitions)
        {
            var category = await useCase.ExecuteAsync(new CreateTransactionCategoryUseCaseInput(userId, name, icon));
            categories[name] = category.Id;
        }

        return categories;
    }

    private static async Task SeedBudgetsAsync(
        CreateBudgetUseCase useCase, Guid userId, Dictionary<string, Guid> categories)
    {
        var now = DateTime.UtcNow;

        foreach (var (categoryName, limit) in BudgetDefinitions)
        {
            await useCase.ExecuteAsync(
                new CreateBudgetUseCaseInput(userId, categories[categoryName], now.Year, now.Month, limit));
        }
    }

    private static async Task SeedIncomeAsync(CreateFinancialTransactionUseCase useCase, Guid userId)
    {
        var salaryAmounts = new[] { 5000m, 5000m, 5200m };

        for (var monthsAgo = 2; monthsAgo >= 0; monthsAgo--)
        {
            var amount = salaryAmounts[2 - monthsAgo];
            var recurrence = monthsAgo == 0 ? RecurrenceType.Monthly : RecurrenceType.None;

            await useCase.ExecuteAsync(new CreateFinancialTransactionUseCaseInput(
                userId, amount, DateInMonth(monthsAgo, 5), FinancialTransactionType.Income, recurrence, "Salário", null));
        }

        await useCase.ExecuteAsync(new CreateFinancialTransactionUseCaseInput(
            userId, 1800m, DateInMonth(1, 18), FinancialTransactionType.Income, RecurrenceType.None,
            "Freelance - Projeto de design", null));

        await useCase.ExecuteAsync(new CreateFinancialTransactionUseCaseInput(
            userId, 950m, DateInMonth(0, 10), FinancialTransactionType.Income, RecurrenceType.None,
            "Freelance - Consultoria", null));
    }

    private static async Task SeedRecurringExpensesAsync(
        CreateFinancialTransactionUseCase useCase, Guid userId, Dictionary<string, Guid> categories)
    {
        foreach (var (categoryName, description, amount, day) in RecurringExpenseDefinitions)
        {
            for (var monthsAgo = 2; monthsAgo >= 0; monthsAgo--)
            {
                var recurrence = monthsAgo == 0 ? RecurrenceType.Monthly : RecurrenceType.None;

                await useCase.ExecuteAsync(new CreateFinancialTransactionUseCaseInput(
                    userId, amount, DateInMonth(monthsAgo, day), FinancialTransactionType.Expense, recurrence,
                    description, categories[categoryName]));
            }
        }
    }

    private static async Task SeedRandomExpensesAsync(
        CreateFinancialTransactionUseCase useCase, Guid userId, Dictionary<string, Guid> categories)
    {
        foreach (var (categoryName, description, amount, monthsAgo, day) in RandomExpenseDefinitions)
        {
            await useCase.ExecuteAsync(new CreateFinancialTransactionUseCaseInput(
                userId, amount, DateInMonth(monthsAgo, day), FinancialTransactionType.Expense, RecurrenceType.None,
                description, categories[categoryName]));
        }
    }

    private static DateTime DateInMonth(int monthsAgo, int day)
    {
        var reference = DateTime.UtcNow.AddMonths(-monthsAgo);
        var maxDay = monthsAgo == 0 ? reference.Day : DateTime.DaysInMonth(reference.Year, reference.Month);
        var safeDay = Math.Clamp(day, 1, maxDay);

        return DateTime.SpecifyKind(new DateTime(reference.Year, reference.Month, safeDay), DateTimeKind.Utc);
    }
}

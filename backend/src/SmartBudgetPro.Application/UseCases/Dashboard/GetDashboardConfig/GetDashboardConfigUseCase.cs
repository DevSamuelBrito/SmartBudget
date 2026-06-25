using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardConfig;

public class GetDashboardConfigUseCase(IUserDashboardConfigRepository repository)
{
    private static readonly List<DashboardConfigItemOutput> DefaultConfig =
    [
        new("alertsCard", 0, 1, true),
        new("quickInsightsCard", 1, 1, true),
        new("latestTransactionsCard", 2, 1, true),
        new("budgetProgressCard", 3, 1, true),
        new("balanceEvolutionChart", 4, 2, true),
        new("incomeExpenseBarChart", 5, 1, true),
        new("categoryDistributionFlipCard", 6, 1, true),
        new("financialRiskCard", 7, 2, true),
        new("expenseEvolutionChart", 8, 2, true),
        new("savingsRateCard", 9, 1, true),
        new("monthlyComparisonCard", 10, 1, true),
        new("budgetHealthCard", 11, 1, true),
        new("topExpensesCard", 12, 2, true),
        new("cashFlowChart", 13, 2, true),
    ];

    public async Task<IEnumerable<DashboardConfigItemOutput>> ExecuteAsync(GetDashboardConfigUseCaseInput input)
    {
        var configs = (await repository.GetByUserIdAsync(input.UserId)).ToList();

        if (configs.Count == 0)
        {
            return DefaultConfig;
        }

        return configs.Select(c => new DashboardConfigItemOutput(
            c.ComponentKey,
            c.Order,
            c.Columns,
            c.Visible));
    }
}

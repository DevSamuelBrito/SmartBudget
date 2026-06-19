namespace SmartBudgetPro.Application.Common;

public static class PremiumFeatures
{
    public static readonly IReadOnlySet<string> Icons = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "Plane", "Gem", "Trophy", "Crown", "Rocket", "Sparkles", "Star", "Zap"
    };

    public static readonly IReadOnlySet<string> DashboardComponentKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "expenseEvolutionChart"
    };
}

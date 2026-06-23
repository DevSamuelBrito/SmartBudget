namespace SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardConfig;

public record DashboardConfigItemOutput(
    string ComponentKey,
    int Order,
    int Columns,
    bool Visible);

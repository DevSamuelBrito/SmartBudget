namespace SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;

public class SaveDashboardConfigUseCaseInput
{
    public Guid UserId { get; set; }
    public List<SaveDashboardConfigItem> Items { get; set; } = [];
}

public class SaveDashboardConfigItem
{
    public string ComponentKey { get; set; } = string.Empty;
    public int Order { get; set; }
    public int Columns { get; set; }
    public bool Visible { get; set; }
}

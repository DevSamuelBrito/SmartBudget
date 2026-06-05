namespace SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;

public class GetDashboardOverviewUseCaseInput
{
    public Guid? UserId { get; set; }
    public int? Month { get; set; }
    public int? Year { get; set; }
    public int LatestTransactionsCount { get; set; } = 8;
    public int HistoryMonths { get; set; } = 12;
}

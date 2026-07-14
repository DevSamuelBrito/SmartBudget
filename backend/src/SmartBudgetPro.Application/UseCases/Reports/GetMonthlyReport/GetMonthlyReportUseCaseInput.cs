namespace SmartBudgetPro.Application.UseCases.Reports.GetMonthlyReport;

public record GetMonthlyReportUseCaseInput(Guid UserId, int Month, int Year, string Locale = "pt-BR");

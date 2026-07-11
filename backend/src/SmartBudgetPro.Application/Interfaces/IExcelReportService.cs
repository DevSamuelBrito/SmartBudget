using SmartBudgetPro.Application.Common.DTOs;

namespace SmartBudgetPro.Application.Interfaces;

public interface IExcelReportService
{
    Task<byte[]> GenerateMonthlyReportAsync(MonthlyReportDto report);
}

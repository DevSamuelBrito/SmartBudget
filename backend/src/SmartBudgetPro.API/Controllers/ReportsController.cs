using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using SmartBudgetPro.API.Extensions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.Reports.GetMonthlyReport;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("reports")]
[Authorize]
public class ReportsController(
    GetMonthlyReportUseCase getMonthlyReportUseCase,
    IExcelReportService excelReportService) : ControllerBase
{
    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthlyReport([FromQuery] int month, [FromQuery] int year)
    {
        var userId = User.GetRequiredUserId();
        var input = new GetMonthlyReportUseCaseInput(userId, month, year);

        var report = await getMonthlyReportUseCase.ExecuteAsync(input);

        return Ok(report);
    }

    [HttpGet("monthly/excel")]
    public async Task<IActionResult> GetMonthlyReportExcel([FromQuery] int month, [FromQuery] int year)
    {
        var userId = User.GetRequiredUserId();
        var input = new GetMonthlyReportUseCaseInput(userId, month, year);

        var report = await getMonthlyReportUseCase.ExecuteAsync(input);
        var fileBytes = await excelReportService.GenerateMonthlyReportAsync(report);

        return File(
            fileBytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"SmartBudget-{month}-{year}.xlsx");
    }
}

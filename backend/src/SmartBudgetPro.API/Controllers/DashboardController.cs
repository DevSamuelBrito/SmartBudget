using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.API.Extensions;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardConfig;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;
using SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController(
    GetDashboardOverviewUseCase getDashboardOverviewUseCase,
    GetDashboardConfigUseCase getDashboardConfigUseCase,
    SaveDashboardConfigUseCase saveDashboardConfigUseCase) : ControllerBase
{
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] GetDashboardOverviewUseCaseInput input)
    {
        var userId = User.GetRequiredUserId();
        input.UserId = userId;

        var output = await getDashboardOverviewUseCase.ExecuteAsync(input);

        return Ok(output);
    }

    [HttpGet("config")]
    public async Task<IActionResult> GetConfig()
    {
        var userId = User.GetRequiredUserId();
        var input = new GetDashboardConfigUseCaseInput { UserId = userId };
        var output = await getDashboardConfigUseCase.ExecuteAsync(input);

        return Ok(output);
    }

    [HttpPut("config")]
    public async Task<IActionResult> SaveConfig([FromBody] List<SaveDashboardConfigItem> items)
    {
        var userId = User.GetRequiredUserId();
        var input = new SaveDashboardConfigUseCaseInput
        {
            UserId = userId,
            Items = items
        };

        await saveDashboardConfigUseCase.ExecuteAsync(input);

        return NoContent();
    }
}

using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardConfig;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;
using SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(
    GetDashboardOverviewUseCase getDashboardOverviewUseCase,
    GetDashboardConfigUseCase getDashboardConfigUseCase,
    SaveDashboardConfigUseCase saveDashboardConfigUseCase) : ControllerBase
{
    // TODO: Replace with authenticated user id when auth is implemented
    private static readonly Guid MockedUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] GetDashboardOverviewUseCaseInput input)
    {
        var output = await getDashboardOverviewUseCase.ExecuteAsync(input);

        return Ok(output);
    }

    [HttpGet("config")]
    public async Task<IActionResult> GetConfig()
    {
        var input = new GetDashboardConfigUseCaseInput { UserId = MockedUserId };
        var output = await getDashboardConfigUseCase.ExecuteAsync(input);

        return Ok(output);
    }

    [HttpPut("config")]
    public async Task<IActionResult> SaveConfig([FromBody] List<SaveDashboardConfigItem> items)
    {
        var input = new SaveDashboardConfigUseCaseInput
        {
            UserId = MockedUserId,
            Items = items
        };

        await saveDashboardConfigUseCase.ExecuteAsync(input);

        return NoContent();
    }
}

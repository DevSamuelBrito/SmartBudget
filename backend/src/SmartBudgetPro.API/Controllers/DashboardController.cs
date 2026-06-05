using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(GetDashboardOverviewUseCase getDashboardOverviewUseCase) : ControllerBase
{
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] GetDashboardOverviewUseCaseInput input)
    {
        var output = await getDashboardOverviewUseCase.ExecuteAsync(input);

        return Ok(output);
    }
}

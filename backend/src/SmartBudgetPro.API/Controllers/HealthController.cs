using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[Route("/health")]
[AllowAnonymous]
public class HealthController : ControllerBase
{
    [HttpGet]
    [HttpHead]
    public IActionResult Get()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow.ToString("o") });
    }
}

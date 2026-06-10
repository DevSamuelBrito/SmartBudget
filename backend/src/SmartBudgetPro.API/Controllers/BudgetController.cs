using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.API.Extensions;
using SmartBudgetPro.Application.UseCases.Budget.CreateBudget;
using SmartBudgetPro.Application.UseCases.Budget.DeleteBudget;
using SmartBudgetPro.Application.UseCases.Budget.GetAllBudget;
using SmartBudgetPro.Application.UseCases.Budget.GetBudgetByID;
using SmartBudgetPro.Application.UseCases.Budget.GetBudgetsByPeriod;
using SmartBudgetPro.Application.UseCases.Budget.UpdateBudget;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[Route("api/budgets")]
[Authorize]
public class BudgetController(
    GetAllBudgetUseCase getAllBudgetUseCase,
    GetBudgetByIDUseCase getBudgetByIDUseCase,
    GetBudgetsByPeriodUseCase getBudgetsByPeriodUseCase,
    CreateBudgetUseCase createBudgetUseCase,
    UpdateBudgetUseCase updateBudgetUseCase,
    DeleteBudgetUseCase deleteBudgetUseCase) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetRequiredUserId();
        var output = await getAllBudgetUseCase.ExecuteAsync(userId);

        return Ok(output);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(Guid id)
    {
        var userId = User.GetRequiredUserId();
        var output = await getBudgetByIDUseCase.ExecuteAsync(userId, id);

        return Ok(output);
    }

    [HttpGet("by-period")]
    public async Task<IActionResult> GetByPeriod([FromQuery] int month, [FromQuery] int year)
    {
        var userId = User.GetRequiredUserId();
        var output = await getBudgetsByPeriodUseCase.ExecuteAsync(userId, month, year);

        return Ok(output);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBudgetUseCaseInput input)
    {
        var userId = User.GetRequiredUserId();
        var securedInput = input with { UserId = userId };

        var output = await createBudgetUseCase.ExecuteAsync(securedInput);

        return Created($"api/budgets/{output.Id}", output);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBudgetUseCaseInput input)
    {
        var userId = User.GetRequiredUserId();
        await updateBudgetUseCase.ExecuteAsync(userId, id, input);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.GetRequiredUserId();
        await deleteBudgetUseCase.ExecuteAsync(userId, id);

        return NoContent();
    }
}
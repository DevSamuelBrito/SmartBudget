using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.Budget.CreateBudget;
using SmartBudgetPro.Application.UseCases.Budget.DeleteBudget;
using SmartBudgetPro.Application.UseCases.Budget.GetAllBudget;
using SmartBudgetPro.Application.UseCases.Budget.GetBudgetByID;
using SmartBudgetPro.Application.UseCases.Budget.GetBudgetsByPeriod;
using SmartBudgetPro.Application.UseCases.Budget.UpdateBudget;

namespace SmartBudgetPro.API.Controllers;

[ApiController]
[Route("api/budgets")]
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
        var output = await getAllBudgetUseCase.ExecuteAsync();

        return Ok(output);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(Guid id)
    {
        var output = await getBudgetByIDUseCase.ExecuteAsync(id);

        return Ok(output);
    }

    [HttpGet("by-period")]
    public async Task<IActionResult> GetByPeriod([FromQuery] int month, [FromQuery] int year)
    {
        var output = await getBudgetsByPeriodUseCase.ExecuteAsync(month, year);

        return Ok(output);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBudgetUseCaseInput input)
    {
        var output = await createBudgetUseCase.ExecuteAsync(input);

        return Created($"api/budgets/{output.Id}", output);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBudgetUseCaseInput input)
    {
        await updateBudgetUseCase.ExecuteAsync(id, input);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await deleteBudgetUseCase.ExecuteAsync(id);

        return NoContent();
    }
}
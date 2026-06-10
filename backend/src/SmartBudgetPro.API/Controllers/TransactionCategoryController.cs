using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.API.Extensions;
using SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.DeleteTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.UpdateTransactionCategory;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/transactionCategories")]
    [Authorize]
    public class TransactionCategoryController
        (
        GetAllTransactionCategoryUseCase getAllTransactionCategory,
        CreateTransactionCategoryUseCase createTransactionCategory,
        UpdateTransactionCategoryUseCase updateTransactionCategory,
        DeleteTransactionCategoryUseCase deleteTransactionCategoryUseCase
        )
        : ControllerBase
    {


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.GetRequiredUserId();
            var output = await getAllTransactionCategory.ExecuteAsync(userId);

            return Ok(output);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransactionCategoryUseCaseInput input)
        {
            var userId = User.GetRequiredUserId();
            var securedInput = input with { UserId = userId };

            var output = await createTransactionCategory.ExecuteAsync(securedInput);

            return Created($"api/transactionCategories/{output.Id}", output);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateTransactionCategoryUseCaseInput input)
        {
            var userId = User.GetRequiredUserId();
            await updateTransactionCategory.ExecuteAsync(userId, input);

            return Ok();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = User.GetRequiredUserId();
            var input = new DeleteTransactionCategoryUseCaseInput
            {
                id = id
            };

            await deleteTransactionCategoryUseCase.ExecuteAsync(userId, input);

            return NoContent();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.DeleteTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.UpdateTransactionCategory;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/transactionCategories")]
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
            var output = await getAllTransactionCategory.ExecuteAsync();

            return Ok(output);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransactionCategoryUseCaseInput input)
        {
            var output = await createTransactionCategory.ExecuteAsync(input);

            return Created($"api/transactionCategories/{output.Id}", output);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateTransactionCategoryUseCaseInput input)
        {
            await updateTransactionCategory.ExecuteAsync(input);

            return Ok();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var input = new DeleteTransactionCategoryUseCaseInput
            {
                id = id
            };

            await deleteTransactionCategoryUseCase.ExecuteAsync(input);

            return NoContent();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;
using SmartBudgetPro.Application.UseCases.TransactionCategory.CreateTransactionCategory;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/transactionCategories")]
    public class TransactionCategoryController
        (
        GetAllTransactionCategoryUseCase getAllTransactionCategory,
        CreateTransactionCategoryUseCase createTransactionCategory
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

    }
}

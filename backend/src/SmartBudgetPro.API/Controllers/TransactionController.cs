using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction;
using SmartBudgetPro.Application.UseCases.Transaction.GetAllTransaction;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionController
        (
            GetAllFinancialTransactionUseCase getAllTransaction,
            CreateFinancialTransactionUseCase createTransactionUseCase
        ) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var output = await getAllTransaction.ExecuteAsync();

            return Ok(output);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransactionUseCaseInput input)
        {
            var output = await createTransactionUseCase.ExecuteAsync(input);

            return Created($"/api/transactions/{output}", new { output });
        }

    }
}

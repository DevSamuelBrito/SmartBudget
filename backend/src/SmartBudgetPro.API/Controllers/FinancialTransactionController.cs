using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.FinancialTransaction.DeleteFinancialTransaction;
using SmartBudgetPro.Application.UseCases.FinancialTransaction.UpdateFinancialTransaction;
using SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction;
using SmartBudgetPro.Application.UseCases.Transaction.GetAllTransaction;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionController
        (
            GetAllFinancialTransactionUseCase getAllTransaction,
            CreateFinancialTransactionUseCase createTransactionUseCase,
            UpdateFinancialTransactionUseCase updateFinancialTransactionUseCase,
            DeleteFinancialTransactionUseCase deleteFinancialTransactionUseCase
        ) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var output = await getAllTransaction.ExecuteAsync();

            return Ok(output);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFinancialTransactionUseCaseInput input)
        {
            var output = await createTransactionUseCase.ExecuteAsync(input);

            return Created($"/api/transactions/{output}", new { output });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateFinancialTransactionUseCaseInput input)
        {

            await updateFinancialTransactionUseCase.ExecuteAsync(id, input);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var input = new DeleteFinancialTransactionUseCaseInput
            {
                id = id
            };

            await deleteFinancialTransactionUseCase.ExecuteAsync(input);

            return NoContent();
        }

    }
}

using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.UseCases.Transaction.GetAllTransaction;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionController
        (
            GetAllTransactionUseCase getAllTransaction
        ) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var output = await getAllTransaction.ExecuteAsync();

            return Ok(output);
        }

    }
}

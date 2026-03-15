using Microsoft.AspNetCore.Mvc;
using SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;

namespace SmartBudgetPro.API.Controllers
{
    [ApiController]
    [Route("api/transactionCategories")]
    public class TransactionCategoryController
        (
        GetAllTransactionCategory getAllTransactionCategory
        )
        : ControllerBase
    {


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var output = await getAllTransactionCategory.ExecuteAsync();

            return Ok(output);
        }

    }
}

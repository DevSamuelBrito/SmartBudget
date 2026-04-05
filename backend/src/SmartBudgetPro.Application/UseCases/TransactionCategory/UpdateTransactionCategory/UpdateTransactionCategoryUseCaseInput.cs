
namespace SmartBudgetPro.Application.UseCases.TransactionCategory.UpdateTransactionCategory
{
    public record UpdateTransactionCategoryUseCaseInput
    (
        Guid Id,
        string Name
    );
}

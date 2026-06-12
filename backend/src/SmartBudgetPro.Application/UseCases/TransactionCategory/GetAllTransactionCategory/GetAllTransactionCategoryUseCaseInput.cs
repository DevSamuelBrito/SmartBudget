using SmartBudgetPro.Shared.Pagination;

namespace SmartBudgetPro.Application.TransactionCategory.GetAllTransactionCategory;

public record GetAllTransactionCategoryUseCaseInput : PagedQuery
{
    public Guid UserId { get; init; }
}
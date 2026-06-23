using SmartBudgetPro.Shared.Pagination;

namespace SmartBudgetPro.Application.UseCases.Transaction.GetAllTransaction;

public record GetAllFinancialTransactionUseCaseInput : PagedQuery
{
    public Guid UserId { get; init; }
}
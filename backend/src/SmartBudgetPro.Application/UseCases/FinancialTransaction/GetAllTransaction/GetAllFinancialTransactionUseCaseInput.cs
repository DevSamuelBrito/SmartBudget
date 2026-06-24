using SmartBudgetPro.Domain.Transactions;
using SmartBudgetPro.Shared.Pagination;

namespace SmartBudgetPro.Application.UseCases.Transaction.GetAllTransaction;

public record GetAllFinancialTransactionUseCaseInput : PagedQuery
{
    public Guid UserId { get; init; }
    public string? Description { get; init; }
    public Guid? CategoryId { get; init; }
    public DateTime? Date { get; init; }
    public FinancialTransactionType? Type { get; init; }
    public RecurrenceType? Recurrence { get; init; }
}
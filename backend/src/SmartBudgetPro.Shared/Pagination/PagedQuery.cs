namespace SmartBudgetPro.Shared.Pagination;

public abstract record PagedQuery
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 10;

    public int Page { get; init; } = DefaultPage;

    public int PageSize { get; init; } = DefaultPageSize;
}
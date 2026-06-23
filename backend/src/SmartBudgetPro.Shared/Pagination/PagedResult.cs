namespace SmartBudgetPro.Shared.Pagination;

public sealed class PagedResult<T>
{
    public IReadOnlyList<T> Items { get; }

    public int TotalCount { get; }

    public int Page { get; }

    public int PageSize { get; }

    public int TotalPages => TotalCount == 0 ? 0 : (int)Math.Ceiling((double)TotalCount / PageSize);

    public bool HasNextPage => Page < TotalPages;

    public bool HasPreviousPage => Page > 1 && TotalPages > 0;

    public PagedResult(IEnumerable<T> items, int totalCount, int page, int pageSize)
    {
        if (page < 1)
            throw new ArgumentOutOfRangeException(nameof(page), "Page must be greater than zero.");

        if (pageSize < 1)
            throw new ArgumentOutOfRangeException(nameof(pageSize), "PageSize must be greater than zero.");

        if (totalCount < 0)
            throw new ArgumentOutOfRangeException(nameof(totalCount), "TotalCount cannot be negative.");

        Items = items?.ToList() ?? [];
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
    }
}
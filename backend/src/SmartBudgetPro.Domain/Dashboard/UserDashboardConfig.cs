namespace SmartBudgetPro.Domain.Dashboard;

public class UserDashboardConfig
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string ComponentKey { get; private set; } = string.Empty;
    public int Order { get; private set; }
    public int Columns { get; private set; }
    public bool Visible { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private UserDashboardConfig() { } // For EF Core

    private UserDashboardConfig(Guid userId, string componentKey, int order, int columns, bool visible)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("Invalid userId.", nameof(userId));

        if (string.IsNullOrWhiteSpace(componentKey))
            throw new ArgumentException("ComponentKey is required.", nameof(componentKey));

        if (columns is not (1 or 2))
            throw new ArgumentOutOfRangeException(nameof(columns), "Columns must be 1 or 2.");

        if (order < 0)
            throw new ArgumentOutOfRangeException(nameof(order), "Order must be non-negative.");

        Id = Guid.NewGuid();
        UserId = userId;
        ComponentKey = componentKey.Trim();
        Order = order;
        Columns = columns;
        Visible = visible;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static UserDashboardConfig Create(Guid userId, string componentKey, int order, int columns, bool visible)
    {
        return new UserDashboardConfig(userId, componentKey, order, columns, visible);
    }

    public void Update(int order, int columns, bool visible)
    {
        if (columns is not (1 or 2))
            throw new ArgumentOutOfRangeException(nameof(columns), "Columns must be 1 or 2.");

        if (order < 0)
            throw new ArgumentOutOfRangeException(nameof(order), "Order must be non-negative.");

        Order = order;
        Columns = columns;
        Visible = visible;
        UpdatedAt = DateTime.UtcNow;
    }
}

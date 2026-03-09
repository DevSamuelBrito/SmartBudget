namespace SmartBudgetPro.Domain;

public class TransactionCategory
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private TransactionCategory() { } // For EF Core

    private TransactionCategory(Guid userId, string name)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("Invalid userId.", nameof(userId));

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name is required.", nameof(name));

        Id = Guid.NewGuid();
        UserId = userId;
        Name = name.Trim();
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static TransactionCategory Create(Guid userId, string name)
    {
        return new TransactionCategory(userId, name);
    }

    public void Rename(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
            throw new ArgumentException("Category name is required.", nameof(newName));

        Name = newName.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}

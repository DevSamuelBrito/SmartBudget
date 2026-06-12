using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Domain.Transactions;

public class TransactionCategory
{
    private const int MaxNameLength = 100;
    private const int MaxIconLength = 200;

    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Icon { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private TransactionCategory() { } // For EF Core

    private TransactionCategory(Guid userId, string name, string icon)
    {
        if (userId == Guid.Empty)
            throw new BusinessBadRequestException("Invalid userId.");

        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessBadRequestException("Category name is required.");

        if (name.Trim().Length > MaxNameLength)
            throw new BusinessBadRequestException($"Category name must have at most {MaxNameLength} characters.");

        var normalizedIcon = string.IsNullOrWhiteSpace(icon) ? string.Empty : icon.Trim();

        if (normalizedIcon.Length > MaxIconLength)
            throw new BusinessBadRequestException($"Icon must have at most {MaxIconLength} characters.");


        Id = Guid.NewGuid();
        UserId = userId;
        Name = name.Trim();
        Icon = normalizedIcon;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static TransactionCategory Create(Guid userId, string name, string icon)
    {
        return new TransactionCategory(userId, name, icon);
    }

    public void Rename(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
            throw new BusinessBadRequestException($"Category name is required. Received '{newName}'");

        if (newName.Trim().Length > MaxNameLength)
            throw new BusinessBadRequestException($"Category name must have at most {MaxNameLength} characters.");

        Name = newName.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeIcon(string newIcon)  // ← e o método para editar
    {
        var normalizedIcon = string.IsNullOrWhiteSpace(newIcon) ? string.Empty : newIcon.Trim();

        if (normalizedIcon.Length > MaxIconLength)
            throw new BusinessBadRequestException($"Icon must have at most {MaxIconLength} characters.");

        Icon = normalizedIcon;
        UpdatedAt = DateTime.UtcNow;
    }
}

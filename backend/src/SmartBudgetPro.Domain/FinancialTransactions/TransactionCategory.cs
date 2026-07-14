using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Domain.Transactions;

public class TransactionCategory
{
    private const int MaxNameLength = 100;
    private const int MaxIconLength = 200;

    // Keep in sync manually with the frontend iconMap in
    // frontend/app/[locale]/(app)/categories/components/theme-icons.tsx —
    // whenever a new icon is added there, add its exact name here too.
    private static readonly HashSet<string> ValidIcons = new(StringComparer.OrdinalIgnoreCase)
    {
        "ShoppingBasket", "Lightbulb", "Droplets", "Wifi", "BusFront", "HeartPulse",
        "Cross", "Gamepad2", "Utensils", "Car", "Home", "GraduationCap", "Receipt",
        "ShoppingBag", "Plane", "Gem", "Trophy", "Crown", "Rocket", "Sparkles", "Star", "Zap",
    };

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

        if (normalizedIcon.Length > 0 && !ValidIcons.Contains(normalizedIcon))
            throw new BusinessBadRequestException("Invalid icon name.");

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

    public void ChangeIcon(string newIcon)
    {
        var normalizedIcon = string.IsNullOrWhiteSpace(newIcon) ? string.Empty : newIcon.Trim();

        if (normalizedIcon.Length > MaxIconLength)
            throw new BusinessBadRequestException($"Icon must have at most {MaxIconLength} characters.");

        if (normalizedIcon.Length > 0 && !ValidIcons.Contains(normalizedIcon))
            throw new BusinessBadRequestException("Invalid icon name.");

        Icon = normalizedIcon;
        UpdatedAt = DateTime.UtcNow;
    }
}

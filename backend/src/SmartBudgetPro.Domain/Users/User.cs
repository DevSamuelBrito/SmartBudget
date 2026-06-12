using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Domain.Users;

public class User
{
    private const int MaxNameLength = 150;
    private const int MaxEmailLength = 254;
    private const int MaxPasswordHashLength = 500;

    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;

    private User() { } // For EF Core

    private User(string name, string email, string passwordHash)
    {
        Id = Guid.NewGuid();
        Name = ValidateAndNormalizeName(name);
        Email = ValidateAndNormalizeEmail(email);
        PasswordHash = ValidatePasswordHash(passwordHash);
    }

    public static User Create(string name, string email, string passwordHash)
    {
        return new User(name, email, passwordHash);
    }

    public void Update(string name, string email)
    {
        Name = ValidateAndNormalizeName(name);
        Email = ValidateAndNormalizeEmail(email);
    }

    public void Rename(string newName)
    {
        Name = ValidateAndNormalizeName(newName);
    }

    public void ChangeEmail(string newEmail)
    {
        Email = ValidateAndNormalizeEmail(newEmail);
    }

    public void ChangePasswordHash(string newPasswordHash)
    {
        PasswordHash = ValidatePasswordHash(newPasswordHash);
    }

    private static string ValidateAndNormalizeName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessBadRequestException("Name is required.");

        var normalized = name.Trim();

        if (normalized.Length > MaxNameLength)
            throw new BusinessBadRequestException($"Name must have at most {MaxNameLength} characters.");

        return normalized;
    }

    private static string ValidateAndNormalizeEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new BusinessBadRequestException("Email is required.");

        var normalized = email.Trim();

        if (normalized.Length > MaxEmailLength)
            throw new BusinessBadRequestException($"Email must have at most {MaxEmailLength} characters.");

        return normalized;
    }

    private static string ValidatePasswordHash(string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new BusinessBadRequestException("Password hash is required.");

        var normalized = passwordHash.Trim();

        if (normalized.Length > MaxPasswordHashLength)
            throw new BusinessBadRequestException($"Password hash must have at most {MaxPasswordHashLength} characters.");

        return normalized;
    }
}

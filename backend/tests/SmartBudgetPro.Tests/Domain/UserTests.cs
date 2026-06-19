using FluentAssertions;
using SmartBudgetPro.Domain.Users;
using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Tests.Domain;

public class UserTests
{
    // ── Create ────────────────────────────────────────────────────────────────

    [Fact]
    public void Create_ValidData_ShouldCreateUserCorrectly()
    {
        // Arrange / Act
        var user = User.Create("Samuel Brito", "samuel@email.com", "hashed_password_abc");

        // Assert
        user.Name.Should().Be("Samuel Brito");
        user.Email.Should().Be("samuel@email.com");
        user.PasswordHash.Should().Be("hashed_password_abc");
        user.IsPremium.Should().BeFalse();
        user.Id.Should().NotBe(Guid.Empty);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null!)]
    public void Create_InvalidName_ShouldThrowException(string name)
    {
        // Arrange / Act
        var act = () => User.Create(name, "email@email.com", "hash");

        // Assert
        act.Should().Throw<BusinessBadRequestException>()
            .WithMessage("*Name*");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null!)]
    public void Create_InvalidEmail_ShouldThrowException(string email)
    {
        // Arrange / Act
        var act = () => User.Create("Samuel", email, "hash");

        // Assert
        act.Should().Throw<BusinessBadRequestException>()
            .WithMessage("*Email*");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null!)]
    public void Create_InvalidPasswordHash_ShouldThrowException(string passwordHash)
    {
        // Arrange / Act
        var act = () => User.Create("Samuel", "samuel@email.com", passwordHash);

        // Assert
        act.Should().Throw<BusinessBadRequestException>()
            .WithMessage("*Password*");
    }

    [Fact]
    public void Create_NameExceedsMaxLength_ShouldThrowException()
    {
        // Arrange
        var longName = new string('A', 151);

        // Act
        var act = () => User.Create(longName, "samuel@email.com", "hash");

        // Assert
        act.Should().Throw<BusinessBadRequestException>()
            .WithMessage("*150*");
    }

    // ── UpgradeToPremium ──────────────────────────────────────────────────────

    [Fact]
    public void UpgradeToPremium_NonPremiumUser_ShouldSetIsPremiumTrue()
    {
        // Arrange
        var user = User.Create("Samuel", "samuel@email.com", "hash");

        // Act
        user.UpgradeToPremium();

        // Assert
        user.IsPremium.Should().BeTrue();
        user.UpdatedAt.Should().NotBeNull();
        user.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void UpgradeToPremium_CalledTwice_ShouldBeIdempotent()
    {
        // Arrange
        var user = User.Create("Samuel", "samuel@email.com", "hash");
        user.UpgradeToPremium();
        var firstUpdatedAt = user.UpdatedAt;

        // Act
        user.UpgradeToPremium(); // segunda chamada

        // Assert
        user.IsPremium.Should().BeTrue();
        user.UpdatedAt.Should().Be(firstUpdatedAt); // não atualizou de novo
    }
}

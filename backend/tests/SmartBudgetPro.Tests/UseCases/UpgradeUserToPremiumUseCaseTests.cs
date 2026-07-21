using FluentAssertions;
using Moq;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.User.UpgradeUserToPremium;
using SmartBudgetPro.Domain.Users;

namespace SmartBudgetPro.Tests.UseCases;

public class UpgradeUserToPremiumUseCaseTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IAuditLogger> _auditLoggerMock = new();
    private readonly UpgradeUserToPremiumUseCase _sut;

    public UpgradeUserToPremiumUseCaseTests()
    {
        _sut = new UpgradeUserToPremiumUseCase(_userRepoMock.Object, _auditLoggerMock.Object);
    }

    // ── Cenário: usuário não encontrado ─────────────────────────────────────

    [Fact]
    public async Task Execute_WhenUserNotFound_ShouldThrowAndNotLogAuditEvent()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _userRepoMock
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync((User?)null);

        // Act
        var act = () => _sut.ExecuteAsync(userId);

        // Assert
        await act.Should().ThrowAsync<UserNotFoundException>();

        _auditLoggerMock.Verify(
            a => a.LogAsync(
                It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Guid?>(), It.IsAny<string?>()),
            Times.Never);
    }

    // ── Cenário: upgrade bem-sucedido ───────────────────────────────────────

    [Fact]
    public async Task Execute_WhenUserIsNotPremium_ShouldUpgradeAndLogAuditEvent()
    {
        // Arrange
        var user = User.Create("Samuel", "samuel@email.com", "hash");

        _userRepoMock
            .Setup(r => r.GetByIdAsync(user.Id))
            .ReturnsAsync(user);

        _userRepoMock
            .Setup(r => r.UpdateAsync(user))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _sut.ExecuteAsync(user.Id);

        // Assert
        result.IsPremium.Should().BeTrue();

        _auditLoggerMock.Verify(
            a => a.LogAsync(
                user.Id,
                "UserUpgradedToPremium",
                "User",
                user.Id,
                It.IsAny<string?>()),
            Times.Once);
    }

    // ── Cenário: usuário já é premium ───────────────────────────────────────

    [Fact]
    public async Task Execute_WhenUserIsAlreadyPremium_ShouldNotLogAuditEventAgain()
    {
        // Arrange
        var user = User.Create("Samuel", "samuel@email.com", "hash");
        user.UpgradeToPremium();

        _userRepoMock
            .Setup(r => r.GetByIdAsync(user.Id))
            .ReturnsAsync(user);

        // Act
        await _sut.ExecuteAsync(user.Id);

        // Assert
        _userRepoMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Never);

        _auditLoggerMock.Verify(
            a => a.LogAsync(
                It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Guid?>(), It.IsAny<string?>()),
            Times.Never);
    }
}

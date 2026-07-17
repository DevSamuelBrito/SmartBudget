using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Moq;
using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardConfig;
using SmartBudgetPro.Domain.Dashboard;
using SmartBudgetPro.Domain.Users;

namespace SmartBudgetPro.Tests.UseCases;

public class GetDashboardConfigUseCaseTests
{
    private readonly Mock<IUserDashboardConfigRepository> _repoMock = new();
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IValidator<GetDashboardConfigUseCaseInput>> _validatorMock = new();
    private readonly GetDashboardConfigUseCase _sut;

    private static readonly Guid UserId = Guid.NewGuid();

    public GetDashboardConfigUseCaseTests()
    {
        _sut = new GetDashboardConfigUseCase(
            _validatorMock.Object,
            _repoMock.Object,
            _userRepoMock.Object);

        // Validator nunca lança por padrão nos testes.
        _validatorMock
            .Setup(v => v.ValidateAsync(
                It.IsAny<GetDashboardConfigUseCaseInput>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());
    }

    private GetDashboardConfigUseCaseInput BuildInput() => new() { UserId = UserId };


    [Fact]
    public async Task Execute_WhenFreeUserHasNoSavedConfig_ShouldReturnDefaultConfigWithPremiumComponentsHidden()
    {
        // Arrange
        _userRepoMock
            .Setup(r => r.GetByIdAsync(UserId))
            .ReturnsAsync(User.Create("Samuel", "samuel@email.com", "hash")); // free

        _repoMock
            .Setup(r => r.GetByUserIdAsync(UserId))
            .ReturnsAsync([]);

        // Act
        var result = (await _sut.ExecuteAsync(BuildInput())).ToList();

        // Assert
        result.Should().HaveCount(14);

        result
            .Where(i => PremiumFeatures.DashboardComponentKeys.Contains(i.ComponentKey))
            .Should().OnlyContain(i => i.Visible == false);

        result
            .Where(i => !PremiumFeatures.DashboardComponentKeys.Contains(i.ComponentKey))
            .Should().OnlyContain(i => i.Visible == true);
    }

    [Fact]
    public async Task Execute_WhenPremiumUserHasNoSavedConfig_ShouldReturnDefaultConfigWithAllComponentsVisible()
    {
        // Arrange
        var premiumUser = User.Create("Samuel", "samuel@email.com", "hash");
        premiumUser.UpgradeToPremium();

        _userRepoMock
            .Setup(r => r.GetByIdAsync(UserId))
            .ReturnsAsync(premiumUser);

        _repoMock
            .Setup(r => r.GetByUserIdAsync(UserId))
            .ReturnsAsync([]);

        // Act
        var result = (await _sut.ExecuteAsync(BuildInput())).ToList();

        // Assert
        result.Should().OnlyContain(i => i.Visible == true);
    }

    // ── Cenário: usuário foi premium, salvou config com premium visível, ──────
    // ── e depois foi rebaixado para free ───────────────────────────────────────

    [Fact]
    public async Task Execute_WhenFreeUserHasPersistedPremiumComponentVisible_ShouldForceItInvisible()
    {
        // Arrange
        _userRepoMock
            .Setup(r => r.GetByIdAsync(UserId))
            .ReturnsAsync(User.Create("Samuel", "samuel@email.com", "hash")); // free

        var persistedConfigs = new List<UserDashboardConfig>
        {
            UserDashboardConfig.Create(UserId, "alertsCard", 0, 1, true),
            UserDashboardConfig.Create(UserId, "cashFlowChart", 1, 2, true), // premium, ficou visível de quando era premium
        };

        _repoMock
            .Setup(r => r.GetByUserIdAsync(UserId))
            .ReturnsAsync(persistedConfigs);

        // Act
        var result = (await _sut.ExecuteAsync(BuildInput())).ToList();

        // Assert
        result.Single(i => i.ComponentKey == "cashFlowChart").Visible.Should().BeFalse();
        result.Single(i => i.ComponentKey == "alertsCard").Visible.Should().BeTrue();
    }
}

using FluentValidation;
using FluentValidation.Results;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;
using SmartBudgetPro.Domain.Dashboard;
using SmartBudgetPro.Domain.Users;

namespace SmartBudgetPro.Tests.UseCases;

public class SaveDashboardConfigUseCaseTests
{
    private readonly Mock<IUserDashboardConfigRepository> _repoMock = new();
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IValidator<SaveDashboardConfigUseCaseInput>> _validatorMock = new();
    private readonly Mock<ILogger<SaveDashboardConfigUseCase>> _loggerMock = new();
    private readonly SaveDashboardConfigUseCase _sut;

    private static readonly Guid UserId = Guid.NewGuid();

    public SaveDashboardConfigUseCaseTests()
    {
        _sut = new SaveDashboardConfigUseCase(
            _repoMock.Object,
            _userRepoMock.Object,
            _validatorMock.Object,
            _loggerMock.Object);

        // Validator nunca lança por padrão nos testes.
        // Nota: nesta versão do FluentValidation, IValidator<T>.ValidateAsync(input)
        // resolve para o overload (T, CancellationToken) diretamente, não para
        // ValidationContext<T> (usado apenas pela rota ValidateAndThrowAsync).
        _validatorMock
            .Setup(v => v.ValidateAsync(
                It.IsAny<SaveDashboardConfigUseCaseInput>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _repoMock
            .Setup(r => r.SaveAsync(It.IsAny<IEnumerable<UserDashboardConfig>>()))
            .Returns(Task.CompletedTask);
    }

    // Payload igual ao que o GET (já corrigido) devolve para um usuário free:
    // todos os 14 componentes presentes, os premium marcados com Visible = false.
    private static List<SaveDashboardConfigItem> BuildDefaultConfigPayload() =>
    [
        new() { ComponentKey = "alertsCard", Order = 0, Columns = 1, Visible = true },
        new() { ComponentKey = "quickInsightsCard", Order = 1, Columns = 1, Visible = true },
        new() { ComponentKey = "latestTransactionsCard", Order = 2, Columns = 1, Visible = true },
        new() { ComponentKey = "budgetProgressCard", Order = 3, Columns = 1, Visible = true },
        new() { ComponentKey = "balanceEvolutionChart", Order = 4, Columns = 2, Visible = true },
        new() { ComponentKey = "incomeExpenseBarChart", Order = 5, Columns = 1, Visible = true },
        new() { ComponentKey = "categoryDistributionFlipCard", Order = 6, Columns = 1, Visible = true },
        new() { ComponentKey = "financialRiskCard", Order = 7, Columns = 2, Visible = true },
        new() { ComponentKey = "expenseEvolutionChart", Order = 8, Columns = 2, Visible = false },
        new() { ComponentKey = "savingsRateCard", Order = 9, Columns = 1, Visible = false },
        new() { ComponentKey = "monthlyComparisonCard", Order = 10, Columns = 1, Visible = false },
        new() { ComponentKey = "budgetHealthCard", Order = 11, Columns = 1, Visible = false },
        new() { ComponentKey = "topExpensesCard", Order = 12, Columns = 2, Visible = false },
        new() { ComponentKey = "cashFlowChart", Order = 13, Columns = 2, Visible = false },
    ];

    // ── Cenário do bug: free user salva a config padrão sem alterar nada ──────

    [Fact]
    public async Task Execute_WhenFreeUserSavesDefaultConfigUnchanged_ShouldNotThrow()
    {
        // Arrange
        _userRepoMock
            .Setup(r => r.GetByIdAsync(UserId))
            .ReturnsAsync(User.Create("Samuel", "samuel@email.com", "hash")); // free (IsPremium = false)

        var input = new SaveDashboardConfigUseCaseInput
        {
            UserId = UserId,
            Items = BuildDefaultConfigPayload(),
        };

        // Act
        var act = async () => await _sut.ExecuteAsync(input);

        // Assert
        await act.Should().NotThrowAsync();

        _repoMock.Verify(
            r => r.SaveAsync(It.Is<IEnumerable<UserDashboardConfig>>(c => c.Count() == 14)),
            Times.Once);
    }

    // ── Cenário: free user tenta habilitar um componente premium ──────────────

    [Fact]
    public async Task Execute_WhenFreeUserTriesToEnablePremiumComponent_ShouldThrowPremiumPlanRequiredException()
    {
        // Arrange
        _userRepoMock
            .Setup(r => r.GetByIdAsync(UserId))
            .ReturnsAsync(User.Create("Samuel", "samuel@email.com", "hash")); // free

        var items = BuildDefaultConfigPayload();
        items.Single(i => i.ComponentKey == "cashFlowChart").Visible = true;

        var input = new SaveDashboardConfigUseCaseInput { UserId = UserId, Items = items };

        // Act
        var act = async () => await _sut.ExecuteAsync(input);

        // Assert
        await act.Should().ThrowAsync<PremiumPlanRequiredException>();

        _repoMock.Verify(r => r.SaveAsync(It.IsAny<IEnumerable<UserDashboardConfig>>()), Times.Never);
    }

    // ── Cenário: usuário premium pode salvar componentes premium visíveis ─────

    [Fact]
    public async Task Execute_WhenPremiumUserSavesConfigWithPremiumComponentsVisible_ShouldNotThrow()
    {
        // Arrange
        var premiumUser = User.Create("Samuel", "samuel@email.com", "hash");
        premiumUser.UpgradeToPremium();

        _userRepoMock
            .Setup(r => r.GetByIdAsync(UserId))
            .ReturnsAsync(premiumUser);

        var input = new SaveDashboardConfigUseCaseInput
        {
            UserId = UserId,
            Items = BuildDefaultConfigPayload()
                .Select(i => new SaveDashboardConfigItem
                {
                    ComponentKey = i.ComponentKey,
                    Order = i.Order,
                    Columns = i.Columns,
                    Visible = true,
                })
                .ToList(),
        };

        // Act
        var act = async () => await _sut.ExecuteAsync(input);

        // Assert
        await act.Should().NotThrowAsync();
    }
}

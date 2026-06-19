using FluentAssertions;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Tests.Domain;

public class BudgetTests
{
    private static readonly Guid ValidUserId = Guid.NewGuid();
    private static readonly Guid ValidCategoryId = Guid.NewGuid();

    // ── Create ────────────────────────────────────────────────────────────────

    [Fact]
    public void Create_ValidData_ShouldCreateBudgetCorrectly()
    {
        // Arrange
        var limitAmount = 1000m;

        // Act
        var budget = Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, limitAmount);

        // Assert
        budget.UserId.Should().Be(ValidUserId);
        budget.TransactionCategoryId.Should().Be(ValidCategoryId);
        budget.Year.Should().Be(2026);
        budget.Month.Should().Be(6);
        budget.LimitAmount.Should().Be(limitAmount);
        budget.SpentAmount.Should().Be(0m);
        budget.Status.Should().Be(BudgetStatus.Ok);
        budget.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-500)]
    public void Create_LimitAmountLessThanOrEqualToZero_ShouldThrowException(decimal limitAmount)
    {
        // Arrange / Act
        var act = () => Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, limitAmount);

        // Assert
        act.Should().Throw<BusinessBadRequestException>()
            .WithMessage("*limit*");
    }

    [Fact]
    public void Create_EmptyUserId_ShouldThrowException()
    {
        // Arrange / Act
        var act = () => Budget.Create(Guid.Empty, ValidCategoryId, 2026, 6, 500m);

        // Assert
        act.Should().Throw<BusinessBadRequestException>();
    }

    [Fact]
    public void Create_EmptyCategoryId_ShouldThrowException()
    {
        // Arrange / Act
        var act = () => Budget.Create(ValidUserId, Guid.Empty, 2026, 6, 500m);

        // Assert
        act.Should().Throw<BusinessBadRequestException>();
    }

    // ── RecalculateFromExpenses ───────────────────────────────────────────────

    [Theory]
    [InlineData(0)]
    [InlineData(100)]
    [InlineData(599.99)]
    public void RecalculateFromExpenses_SpentBelow60Percent_ShouldSetStatusOk(decimal spent)
    {
        // Arrange
        var budget = Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, 1000m);

        // Act
        budget.RecalculateFromExpenses(spent);

        // Assert
        budget.Status.Should().Be(BudgetStatus.Ok);
        budget.SpentAmount.Should().Be(spent);
    }

    [Theory]
    [InlineData(800)]
    [InlineData(900)]
    [InlineData(999.99)]
    public void RecalculateFromExpenses_SpentBetween80And100Percent_ShouldSetStatusWarning(decimal spent)
    {
        // Arrange
        var budget = Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, 1000m);

        // Act
        budget.RecalculateFromExpenses(spent);

        // Assert
        budget.Status.Should().Be(BudgetStatus.Warning);
    }

    [Theory]
    [InlineData(1000)]
    [InlineData(1500)]
    [InlineData(2000)]
    public void RecalculateFromExpenses_SpentAbove100Percent_ShouldSetStatusExceeded(decimal spent)
    {
        // Arrange
        var budget = Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, 1000m);

        // Act
        budget.RecalculateFromExpenses(spent);

        // Assert
        budget.Status.Should().Be(BudgetStatus.Exceeded);
    }

    [Fact]
    public void RecalculateFromExpenses_NegativeAmount_ShouldThrowException()
    {
        // Arrange
        var budget = Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, 1000m);

        // Act
        var act = () => budget.RecalculateFromExpenses(-1m);

        // Assert
        act.Should().Throw<BusinessBadRequestException>()
            .WithMessage("*negative*");
    }

    // ── UpdateLimit ───────────────────────────────────────────────────────────

    [Fact]
    public void UpdateLimit_NegativeValue_ShouldThrowException()
    {
        // Arrange
        var budget = Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, 1000m);

        // Act
        var act = () => budget.UpdateLimit(-100m);

        // Assert
        act.Should().Throw<BusinessBadRequestException>()
            .WithMessage("*limit*");
    }

    [Fact]
    public void UpdateLimit_ZeroValue_ShouldThrowException()
    {
        // Arrange
        var budget = Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, 1000m);

        // Act
        var act = () => budget.UpdateLimit(0m);

        // Assert
        act.Should().Throw<BusinessBadRequestException>();
    }

    [Fact]
    public void UpdateLimit_ValidValue_ShouldUpdateLimitAndRecalculateStatus()
    {
        // Arrange
        var budget = Budget.Create(ValidUserId, ValidCategoryId, 2026, 6, 1000m);
        budget.RecalculateFromExpenses(950m); // Warning

        // Act
        budget.UpdateLimit(500m); // 950 / 500 = 190% → Exceeded

        // Assert
        budget.LimitAmount.Should().Be(500m);
        budget.Status.Should().Be(BudgetStatus.Exceeded);
    }
}

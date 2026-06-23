using FluentAssertions;
using Moq;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;
using SmartBudgetPro.Domain.Users;

namespace SmartBudgetPro.Tests.UseCases;

public class GetDashboardOverviewUseCaseTests
{
    private readonly Mock<IFinancialTransactionRepository> _transactionRepoMock = new();
    private readonly Mock<ITransactionCategoryRepository> _categoryRepoMock = new();
    private readonly Mock<IBudgetRepository> _budgetRepoMock = new();
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly GetDashboardOverviewUseCase _sut;

    private static readonly Guid UserId = Guid.NewGuid();

    // Período fixo em janeiro 2026 para evitar variações do dia corrente
    private static readonly int TargetYear = 2026;
    private static readonly int TargetMonth = 1;

    // Janela usada pelo use case para calcular averageIncome: [nov-2025, fev-2026)
    private static readonly DateTime IncomeWindowStart = new(2025, 11, 1);

    public GetDashboardOverviewUseCaseTests()
    {
        _sut = new GetDashboardOverviewUseCase(
            _transactionRepoMock.Object,
            _categoryRepoMock.Object,
            _budgetRepoMock.Object,
            _userRepoMock.Object);

        // Defaults reutilizados em todos os testes
        _userRepoMock
            .Setup(r => r.GetByIdAsync(UserId))
            .ReturnsAsync(User.Create("Samuel", "samuel@email.com", "hash"));

        _categoryRepoMock
            .Setup(r => r.GetByUserIdAsync(UserId))
            .ReturnsAsync([]);

        _budgetRepoMock
            .Setup(r => r.GetByUserIdAsync(UserId))
            .ReturnsAsync([]);
    }

    private GetDashboardOverviewUseCaseInput BuildInput() => new()
    {
        UserId = UserId,
        Month = TargetMonth,
        Year = TargetYear,
        LatestTransactionsCount = 5,
        HistoryMonths = 3
    };

    // Cria uma transação de Income dentro da janela de averageIncome
    private static FinancialTransaction MakeIncome(decimal amount) =>
        FinancialTransaction.Create(
            UserId,
            categoryId: null,
            amount,
            transactionDate: IncomeWindowStart,
            type: FinancialTransactionType.Income,
            description: "Salário");

    // Cria uma transação de Expense recorrente no mês alvo (conta como fixedExpense)
    private static FinancialTransaction MakeFixedExpense(decimal amount)
    {
        var category = TransactionCategory.Create(UserId, "Moradia", "🏠");
        return FinancialTransaction.Create(
            UserId,
            categoryId: category.Id,
            amount,
            transactionDate: new DateTime(TargetYear, TargetMonth, 5),
            type: FinancialTransactionType.Expense,
            description: "Aluguel",
            recurrence: RecurrenceType.Monthly);
    }

    // ── Cenário: despesas fixas acima de 70% da renda média → FinancialRisk ───

    [Fact]
    public async Task Execute_WhenFixedExpensesAbove70Percent_ShouldReturnRiskStatus()
    {
        // Arrange
        // averageIncome = 3000 / 3 = 1000
        // fixedExpenses = 750 → 75% > 70% → "FinancialRisk"
        var transactions = new List<FinancialTransaction>
        {
            MakeIncome(3000m),
            MakeFixedExpense(750m)
        };

        _transactionRepoMock
            .Setup(r => r.GetByUserIdAsync(UserId))
            .ReturnsAsync(transactions);

        // Act
        var result = await _sut.ExecuteAsync(BuildInput());

        // Assert
        result.FinancialRisk.Status.Should().Be("FinancialRisk");
        result.FinancialRisk.Percentage.Should().BeGreaterThan(70m);
    }

    // ── Cenário: sem renda → NoData ───────────────────────────────────────────

    [Fact]
    public async Task Execute_WhenNoIncome_ShouldReturnNoDataStatus()
    {
        // Arrange — nenhuma transação de Income
        var transactions = new List<FinancialTransaction>
        {
            MakeFixedExpense(500m)
        };

        _transactionRepoMock
            .Setup(r => r.GetByUserIdAsync(UserId))
            .ReturnsAsync(transactions);

        // Act
        var result = await _sut.ExecuteAsync(BuildInput());

        // Assert
        result.FinancialRisk.Status.Should().Be("NoData");
        result.FinancialRisk.AverageIncome.Should().Be(0m);
    }

    // ── Cenário: despesas fixas entre 60-70% da renda → Ok ───────────────────
    // Nota: o use case só distingue "NoData" / "FinancialRisk" / "Ok".
    // Entre 60-70% não há status "Warning"; o resultado correto é "Ok".
    [Fact]
    public async Task Execute_WhenFixedExpensesBetween60And70_ShouldReturnWarningStatus()
    {
        // Arrange
        // averageIncome = 3000 / 3 = 1000
        // fixedExpenses = 650 → 65%, não ultrapassa 70% → "Ok"
        var transactions = new List<FinancialTransaction>
        {
            MakeIncome(3000m),
            MakeFixedExpense(650m)
        };

        _transactionRepoMock
            .Setup(r => r.GetByUserIdAsync(UserId))
            .ReturnsAsync(transactions);

        // Act
        var result = await _sut.ExecuteAsync(BuildInput());

        // Assert
        result.FinancialRisk.Status.Should().Be("Ok");
        result.FinancialRisk.Percentage.Should().BeInRange(60m, 70m);
    }
}

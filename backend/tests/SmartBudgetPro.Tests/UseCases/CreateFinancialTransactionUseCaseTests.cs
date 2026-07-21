using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using Moq;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.Transaction.CreateTransaction;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;
using SmartBudgetPro.Domain.Users;

namespace SmartBudgetPro.Tests.UseCases;

public class CreateFinancialTransactionUseCaseTests
{
    private readonly Mock<IFinancialTransactionRepository> _transactionRepoMock = new();
    private readonly Mock<IValidator<CreateFinancialTransactionUseCaseInput>> _validatorMock = new();
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<ITransactionCategoryRepository> _categoryRepoMock = new();
    private readonly Mock<IBudgetRepository> _budgetRepoMock = new();
    private readonly Mock<ILogger<CreateFinancialTransactionUseCase>> _loggerMock = new();
    private readonly Mock<IAuditLogger> _auditLoggerMock = new();
    private readonly CreateFinancialTransactionUseCase _sut;

    private static readonly Guid UserId = Guid.NewGuid();
    private static readonly DateTime TransactionDate = new(2026, 1, 15);

    public CreateFinancialTransactionUseCaseTests()
    {
        _sut = new CreateFinancialTransactionUseCase(
            _transactionRepoMock.Object,
            _validatorMock.Object,
            _userRepoMock.Object,
            _categoryRepoMock.Object,
            _budgetRepoMock.Object,
            _loggerMock.Object,
            _auditLoggerMock.Object);

        // Validator nunca lança por padrão nos testes
        _validatorMock
            .Setup(v => v.ValidateAsync(
                It.IsAny<ValidationContext<CreateFinancialTransactionUseCaseInput>>(), default))
            .ReturnsAsync(new ValidationResult());

        _userRepoMock
            .Setup(r => r.GetByIdAsync(UserId))
            .ReturnsAsync(User.Create("Samuel", "samuel@email.com", "hash"));

        _transactionRepoMock
            .Setup(r => r.AddAsync(It.IsAny<FinancialTransaction>()))
            .Returns(Task.CompletedTask);
    }

    // ── Cenário: Expense com budget existente ──────────────────────────────────

    [Fact]
    public async Task Execute_WhenExpenseCreated_ShouldRecalculateBudget()
    {
        // Arrange
        var category = TransactionCategory.Create(UserId, "Alimentação", "Utensils");
        var categoryId = category.Id;
        var budget = Budget.Create(UserId, categoryId, TransactionDate.Year, TransactionDate.Month, 500m);

        _categoryRepoMock
            .Setup(r => r.GetByIdAsync(categoryId))
            .ReturnsAsync(category);

        _budgetRepoMock
            .Setup(r => r.GetByUserCategoryAndPeriodAsync(UserId, categoryId, TransactionDate.Year, TransactionDate.Month))
            .ReturnsAsync(budget);

        _transactionRepoMock
            .Setup(r => r.GetTotalExpensesByCategoryAndPeriodAsync(categoryId, TransactionDate.Year, TransactionDate.Month))
            .ReturnsAsync(200m);

        _budgetRepoMock
            .Setup(r => r.UpdateAsync(budget))
            .Returns(Task.CompletedTask);

        var input = new CreateFinancialTransactionUseCaseInput(
            UserId,
            Amount: 200m,
            TransactionDate: TransactionDate,
            TransactionType: FinancialTransactionType.Expense,
            Recurrence: RecurrenceType.None,
            Description: "Supermercado",
            TransactionCategoryId: categoryId);

        // Act
        await _sut.ExecuteAsync(input);

        // Assert
        _budgetRepoMock.Verify(r => r.UpdateAsync(budget), Times.Once);
        budget.SpentAmount.Should().Be(200m);

        // Details deve conter apenas metadados não-sensíveis (nunca valor ou descrição da transação)
        _auditLoggerMock.Verify(
            a => a.LogAsync(
                UserId,
                "TransactionCreated",
                "FinancialTransaction",
                It.IsAny<Guid?>(),
                It.Is<string?>(details =>
                    details == "Type: Expense"
                    && !details.Contains("200")
                    && !details.Contains("Supermercado"))),
            Times.Once);
    }

    // ── Cenário: Expense sem budget cadastrado ─────────────────────────────────

    [Fact]
    public async Task Execute_WhenNoBudgetExists_ShouldNotThrow()
    {
        // Arrange
        var category = TransactionCategory.Create(UserId, "Farmácia", "Cross");
        var categoryId = category.Id;

        _categoryRepoMock
            .Setup(r => r.GetByIdAsync(categoryId))
            .ReturnsAsync(category);

        _budgetRepoMock
            .Setup(r => r.GetByUserCategoryAndPeriodAsync(UserId, categoryId, TransactionDate.Year, TransactionDate.Month))
            .ReturnsAsync((Budget?)null);

        var input = new CreateFinancialTransactionUseCaseInput(
            UserId,
            Amount: 100m,
            TransactionDate: TransactionDate,
            TransactionType: FinancialTransactionType.Expense,
            Recurrence: RecurrenceType.None,
            Description: "Farmácia",
            TransactionCategoryId: categoryId);

        // Act
        var act = () => _sut.ExecuteAsync(input);

        // Assert
        await act.Should().NotThrowAsync();
        _budgetRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Budget>()), Times.Never);
    }

    // ── Cenário: Income não deve recalcular budget ─────────────────────────────

    [Fact]
    public async Task Execute_WhenIncomeCreated_ShouldNotRecalculateBudget()
    {
        // Arrange — Income não tem categoria
        var input = new CreateFinancialTransactionUseCaseInput(
            UserId,
            Amount: 3000m,
            TransactionDate: TransactionDate,
            TransactionType: FinancialTransactionType.Income,
            Recurrence: RecurrenceType.None,
            Description: "Salário",
            TransactionCategoryId: null);

        // Act
        await _sut.ExecuteAsync(input);

        // Assert
        _budgetRepoMock.Verify(
            r => r.GetByUserCategoryAndPeriodAsync(
                It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<int>()),
            Times.Never);

        _budgetRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Budget>()), Times.Never);
    }
}

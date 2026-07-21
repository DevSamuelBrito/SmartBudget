using FluentAssertions;
using Moq;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.TransactionCategory.DeleteTransactionCategory;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Tests.UseCases;

public class DeleteCategoryUseCaseTests
{
    private readonly Mock<ITransactionCategoryRepository> _categoryRepoMock = new();
    private readonly Mock<IFinancialTransactionRepository> _transactionRepoMock = new();
    private readonly Mock<IAuditLogger> _auditLoggerMock = new();
    private readonly DeleteTransactionCategoryUseCase _sut;

    private static readonly Guid UserId = Guid.NewGuid();
    private static readonly Guid CategoryId = Guid.NewGuid();

    public DeleteCategoryUseCaseTests()
    {
        _sut = new DeleteTransactionCategoryUseCase(
            _categoryRepoMock.Object,
            _transactionRepoMock.Object,
            _auditLoggerMock.Object);
    }

    // ── Cenário: categoria não encontrada ─────────────────────────────────────

    [Fact]
    public async Task Execute_WhenCategoryNotFound_ShouldThrowException()
    {
        // Arrange
        _categoryRepoMock
            .Setup(r => r.GetByIdAsync(CategoryId))
            .ReturnsAsync((TransactionCategory?)null);

        var input = new DeleteTransactionCategoryUseCaseInput { id = CategoryId };

        // Act
        var act = () => _sut.ExecuteAsync(UserId, input);

        // Assert
        await act.Should().ThrowAsync<TransactionCategoryNotFoundException>();
        _categoryRepoMock.Verify(r => r.DeleteAsync(It.IsAny<Guid>()), Times.Never);
    }

    // ── Cenário: categoria com transações vinculadas ───────────────────────────

    [Fact]
    public async Task Execute_WhenCategoryHasLinkedTransactions_ShouldThrowException()
    {
        // Arrange
        var category = TransactionCategory.Create(UserId, "Alimentação", "Utensils");

        _categoryRepoMock
            .Setup(r => r.GetByIdAsync(category.Id))
            .ReturnsAsync(category);

        _transactionRepoMock
            .Setup(r => r.ExistsTransactionByCategoryAsync(category.Id))
            .ReturnsAsync(true);

        var input = new DeleteTransactionCategoryUseCaseInput { id = category.Id };

        // Act
        var act = () => _sut.ExecuteAsync(UserId, input);

        // Assert
        await act.Should().ThrowAsync<TransactionCategoryHasLinkedTransactionsException>();
        _categoryRepoMock.Verify(r => r.DeleteAsync(It.IsAny<Guid>()), Times.Never);
    }

    // ── Cenário: deleção bem-sucedida ─────────────────────────────────────────

    [Fact]
    public async Task Execute_WhenCategoryHasNoTransactions_ShouldDeleteSuccessfully()
    {
        // Arrange
        var category = TransactionCategory.Create(UserId, "Transporte", "Car");

        _categoryRepoMock
            .Setup(r => r.GetByIdAsync(category.Id))
            .ReturnsAsync(category);

        _transactionRepoMock
            .Setup(r => r.ExistsTransactionByCategoryAsync(category.Id))
            .ReturnsAsync(false);

        _categoryRepoMock
            .Setup(r => r.DeleteAsync(category.Id))
            .Returns(Task.CompletedTask);

        var input = new DeleteTransactionCategoryUseCaseInput { id = category.Id };

        // Act
        await _sut.ExecuteAsync(UserId, input);

        // Assert
        _categoryRepoMock.Verify(r => r.DeleteAsync(category.Id), Times.Once);

        // Details não deve conter o nome da categoria (dado do usuário)
        _auditLoggerMock.Verify(
            a => a.LogAsync(
                UserId,
                "CategoryDeleted",
                "TransactionCategory",
                category.Id,
                null),
            Times.Once);
    }
}

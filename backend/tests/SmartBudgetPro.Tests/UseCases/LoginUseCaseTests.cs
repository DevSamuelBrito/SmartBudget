using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using Moq;
using SmartBudgetPro.Application.Common.Security;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Application.UseCases.Auth.Login;
using SmartBudgetPro.Domain.Users;

namespace SmartBudgetPro.Tests.UseCases;

public class LoginUseCaseTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IPasswordHasher> _passwordHasherMock = new();
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock = new();
    private readonly Mock<IRefreshTokenRepository> _refreshTokenRepoMock = new();
    private readonly Mock<IValidator<LoginUseCaseInput>> _validatorMock = new();
    private readonly Mock<ILogger<LoginUseCase>> _loggerMock = new();
    private readonly Mock<IAuditLogger> _auditLoggerMock = new();
    private readonly LoginUseCase _sut;

    public LoginUseCaseTests()
    {
        _sut = new LoginUseCase(
            _userRepoMock.Object,
            _passwordHasherMock.Object,
            _jwtTokenGeneratorMock.Object,
            _refreshTokenRepoMock.Object,
            _validatorMock.Object,
            _loggerMock.Object,
            _auditLoggerMock.Object);

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<ValidationContext<LoginUseCaseInput>>(), default))
            .ReturnsAsync(new ValidationResult());
    }

    // ── Cenário: login bem-sucedido ─────────────────────────────────────────

    [Fact]
    public async Task Execute_WhenCredentialsAreValid_ShouldLogUserLoggedInAction()
    {
        // Arrange
        var user = User.Create("Samuel", "samuel@email.com", "hashed-password");

        _userRepoMock
            .Setup(r => r.GetByEmailAsync("samuel@email.com"))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(h => h.Verify("plain-password", user.PasswordHash))
            .Returns(true);

        _jwtTokenGeneratorMock
            .Setup(j => j.Generate(user.Id, user.Email, user.Name, user.IsPremium))
            .Returns(new JwtTokenResult("access-token", 3600));

        _refreshTokenRepoMock
            .Setup(r => r.AddAsync(It.IsAny<SmartBudgetPro.Domain.Auth.RefreshToken>()))
            .Returns(Task.CompletedTask);

        var input = new LoginUseCaseInput("samuel@email.com", "plain-password");

        // Act
        var result = await _sut.ExecuteAsync(input);

        // Assert
        result.UserId.Should().Be(user.Id);

        // Details deve ser genérico e nunca conter o email do usuário
        _auditLoggerMock.Verify(
            a => a.LogAsync(
                user.Id,
                "UserLoggedIn",
                "User",
                user.Id,
                It.Is<string?>(details => details != null && !details.Contains(user.Email))),
            Times.Once);
    }

    // ── Cenário: senha inválida ─────────────────────────────────────────────

    [Fact]
    public async Task Execute_WhenPasswordIsInvalid_ShouldThrowAndNotLogAuditEvent()
    {
        // Arrange
        var user = User.Create("Samuel", "samuel@email.com", "hashed-password");

        _userRepoMock
            .Setup(r => r.GetByEmailAsync("samuel@email.com"))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(h => h.Verify("wrong-password", user.PasswordHash))
            .Returns(false);

        var input = new LoginUseCaseInput("samuel@email.com", "wrong-password");

        // Act
        var act = () => _sut.ExecuteAsync(input);

        // Assert
        await act.Should().ThrowAsync<InvalidCredentialsException>();

        _auditLoggerMock.Verify(
            a => a.LogAsync(
                It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Guid?>(), It.IsAny<string?>()),
            Times.Never);
    }
}

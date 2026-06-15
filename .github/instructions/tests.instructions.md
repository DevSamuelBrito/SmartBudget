---
applyTo: "**/*.test.*"
---

# Testing Guidelines for SmartBudget

This file provides testing patterns and best practices for the SmartBudget project. Follow these patterns when writing unit tests, integration tests, or end-to-end tests.

## Testing Stack

**Frontend (TypeScript/React):**

- **Vitest** - Fast unit test framework (alternative to Jest)
- **React Testing Library** - For component testing
- **@testing-library/user-event** - User interaction simulation
- **Playwright** - E2E testing

**Backend (C#/.NET):**

- **xUnit** - Testing framework
- **Moq** - Mocking library
- **FluentAssertions** - Assertion library for readable tests

## Frontend Testing

### 1. Unit Tests with Vitest

**File Structure**: Colocate tests with source files or in `__tests__/` folder

```
src/
  utils/
    formatCurrency.ts
    formatCurrency.test.ts
```

**Pattern**: `describe` → `it` → Arrange/Act/Assert

```typescript
// lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn() - className merge utility", () => {
  it("should merge base classes with additional classes", () => {
    // Arrange
    const result = cn("px-4 py-2", "bg-red-500");

    // Act & Assert
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
    expect(result).toContain("bg-red-500");
  });

  it("should handle conflicting Tailwind classes (last wins)", () => {
    const result = cn("bg-blue-500 bg-red-500");
    expect(result).toContain("bg-red-500");
  });

  it("should handle undefined and null values", () => {
    const result = cn("px-4", undefined, null, "py-2");
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
  });

  it("should handle conditional classes with objects", () => {
    const result = cn("px-4", { "bg-red-500": true, "bg-blue-500": false });
    expect(result).toContain("bg-red-500");
    expect(result).not.toContain("bg-blue-500");
  });
});
```

### 2. Component Tests with React Testing Library

**Pattern**: Test behavior and user interactions, not implementation

```typescript
// components/ui/button.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"

describe("Button Component", () => {
  it("should render with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("should call onClick handler when clicked", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole("button", { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("should show loading state", () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByText("⟳")).toBeInTheDocument() // Loading spinner
  })

  it("should apply variant classes", () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button")).toHaveClass("border-gray-300")

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole("button")).toHaveClass("hover:bg-gray-100")
  })
})
```

### 3. Form Component Testing

```typescript
// components/login-form.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LoginForm } from "@/components/login-form"

describe("LoginForm Component", () => {
  it("should validate email format", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    // Type invalid email
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, "invalid-email")

    // Type password
    const passwordInput = screen.getByLabelText(/password/i)
    await user.type(passwordInput, "password123")

    // Submit form
    const submitButton = screen.getByRole("button", { name: /login/i })
    await user.click(submitButton)

    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it("should require both email and password", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole("button", { name: /login/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it("should call login action on valid submission", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), "user@example.com")
    await user.type(screen.getByLabelText(/password/i), "password123")

    const submitButton = screen.getByRole("button", { name: /login/i })
    await user.click(submitButton)

    await waitFor(() => {
      // After submission, check for success state (e.g., redirect, message)
      expect(submitButton).not.toHaveAttribute("disabled")
    })
  })
})
```

### 4. Hook Testing with @testing-library/react

```typescript
// hooks/use-budgets.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useBudgets, useCreateBudget } from "@/hooks/use-budgets"

// Create a wrapper with QueryClient provider
const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useBudgets Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch all budgets", async () => {
    const { result } = renderHook(() => useBudgets(), { wrapper: createWrapper() })

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Check data
    expect(result.current.data).toBeDefined()
  })

  it("should handle fetch error", async () => {
    vi.mock("@/lib/services/budget-service", () => ({
      budgetService: {
        getAll: vi.fn().mockRejectedValue(new Error("Network error")),
      },
    }))

    const { result } = renderHook(() => useBudgets(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

describe("useCreateBudget Hook", () => {
  it("should create a budget and invalidate queries", async () => {
    const { result } = renderHook(() => useCreateBudget(), { wrapper: createWrapper() })

    result.current.mutate({ name: "Monthly Budget", limitAmount: 1000 })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Verify success callback was called (toast)
    // This would depend on how you're handling toasts
  })
})
```

### 5. API Service Testing with Mocking

```typescript
// lib/services/budget-service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { budgetService } from "@/lib/services/budget-service";

// Mock axios
vi.mock("@/lib/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Budget Service", () => {
  const mockBudget = {
    id: "1",
    userId: "user-1",
    name: "Monthly Budget",
    limitAmount: 1000,
    status: "Active" as const,
    createdAt: "2024-01-01",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all budgets", async () => {
    const { api } = await import("@/lib/axios");
    vi.mocked(api.get).mockResolvedValue({ data: [mockBudget] });

    const result = await budgetService.getAll();

    expect(api.get).toHaveBeenCalledWith("/budgets");
    expect(result).toEqual([mockBudget]);
  });

  it("should create a budget", async () => {
    const { api } = await import("@/lib/axios");
    const createInput = { name: "Monthly Budget", limitAmount: 1000 };
    vi.mocked(api.post).mockResolvedValue({ data: mockBudget });

    const result = await budgetService.create(createInput);

    expect(api.post).toHaveBeenCalledWith("/budgets", createInput);
    expect(result).toEqual(mockBudget);
  });

  it("should handle API errors gracefully", async () => {
    const { api } = await import("@/lib/axios");
    const error = new Error("Network error");
    vi.mocked(api.get).mockRejectedValue(error);

    await expect(budgetService.getAll()).rejects.toThrow("Network error");
  });
});
```

## Backend Testing

### 1. Use Case Unit Tests with xUnit

**Pattern**: Arrange/Act/Assert with mocked dependencies

```csharp
using Xunit;
using Moq;
using FluentAssertions;
using SmartBudgetPro.Application.UseCases.Budgets.Create;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Application.Interfaces;
using FluentValidation;

public class CreateBudgetUseCaseTests
{
    private readonly Mock<IBudgetRepository> _budgetRepositoryMock;
    private readonly Mock<IValidator<CreateBudgetUseCaseInput>> _validatorMock;
    private readonly CreateBudgetUseCase _useCase;

    public CreateBudgetUseCaseTests()
    {
        _budgetRepositoryMock = new Mock<IBudgetRepository>();
        _validatorMock = new Mock<IValidator<CreateBudgetUseCaseInput>>();
        _useCase = new CreateBudgetUseCase(_budgetRepositoryMock.Object, _validatorMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_WithValidInput_ShouldCreateBudgetSuccessfully()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var input = new CreateBudgetUseCaseInput(
            userId,
            "Monthly Budget",
            1000m
        );

        _validatorMock
            .Setup(v => v.ValidateAndThrowAsync(input, CancellationToken.None))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _useCase.ExecuteAsync(input);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Monthly Budget");
        result.LimitAmount.Should().Be(1000m);

        _budgetRepositoryMock.Verify(
            r => r.AddAsync(It.IsAny<Budget>(), It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task ExecuteAsync_WithInvalidInput_ShouldThrowValidationException()
    {
        // Arrange
        var input = new CreateBudgetUseCaseInput(
            Guid.NewGuid(),
            "",  // Invalid: empty name
            -100m  // Invalid: negative amount
        );

        _validatorMock
            .Setup(v => v.ValidateAndThrowAsync(input, CancellationToken.None))
            .ThrowsAsync(new ValidationException("Validation failed"));

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(input)
        );

        _budgetRepositoryMock.Verify(
            r => r.AddAsync(It.IsAny<Budget>(), It.IsAny<CancellationToken>()),
            Times.Never
        );
    }
}
```

### 2. Repository Tests with Real DbContext

```csharp
using Xunit;
using FluentAssertions;
using SmartBudgetPro.Infrastructure.Persistence;
using SmartBudgetPro.Infrastructure.Persistence.Repositories;
using SmartBudgetPro.Domain.Budgets;
using Microsoft.EntityFrameworkCore;

public class BudgetRepositoryTests : IAsyncLifetime
{
    private readonly AppDbContext _context;
    private readonly BudgetRepository _repository;

    public BudgetRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _repository = new BudgetRepository(_context);
    }

    [Fact]
    public async Task AddAsync_ShouldAddBudgetToDatabase()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var budget = Budget.Create(userId, "Test Budget", 500m);

        // Act
        await _repository.AddAsync(budget);

        // Assert
        var result = await _repository.GetByIdAsync(budget.Id);
        result.Should().NotBeNull();
        result!.Name.Should().Be("Test Budget");
    }

    [Fact]
    public async Task GetByUserIdAsync_ShouldReturnOnlyUserBudgets()
    {
        // Arrange
        var userId1 = Guid.NewGuid();
        var userId2 = Guid.NewGuid();

        var budget1 = Budget.Create(userId1, "Budget 1", 500m);
        var budget2 = Budget.Create(userId1, "Budget 2", 1000m);
        var budget3 = Budget.Create(userId2, "Budget 3", 750m);

        await _repository.AddAsync(budget1);
        await _repository.AddAsync(budget2);
        await _repository.AddAsync(budget3);

        // Act
        var results = await _repository.GetByUserIdAsync(userId1);

        // Assert
        results.Should().HaveCount(2);
        results.Should().AllSatisfy(b => b.UserId.Should().Be(userId1));
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
    }
}
```

### 3. Controller Integration Tests

```csharp
using Xunit;
using Moq;
using FluentAssertions;
using SmartBudgetPro.API.Controllers;
using SmartBudgetPro.Application.UseCases.Budgets.Create;
using SmartBudgetPro.Application.UseCases.Budgets.GetAll;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public class BudgetControllerTests
{
    private readonly Mock<CreateBudgetUseCase> _createUseCaseMock;
    private readonly Mock<GetAllBudgetsUseCase> _getAllUseCaseMock;
    private readonly BudgetController _controller;

    public BudgetControllerTests()
    {
        _createUseCaseMock = new Mock<CreateBudgetUseCase>();
        _getAllUseCaseMock = new Mock<GetAllBudgetsUseCase>();
        _controller = new BudgetController(_createUseCaseMock.Object, _getAllUseCaseMock.Object);

        // Mock User with ClaimsPrincipal
        var userId = Guid.NewGuid().ToString();
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId) };
        var identity = new ClaimsIdentity(claims);
        _controller.ControllerContext.HttpContext = new DefaultHttpContext
        {
            User = new ClaimsPrincipal(identity)
        };
    }

    [Fact]
    public async Task Create_WithValidInput_ShouldReturnCreatedAtAction()
    {
        // Arrange
        var input = new CreateBudgetUseCaseInput(Guid.NewGuid(), "Test Budget", 500m);
        var output = new CreateBudgetUseCaseOutput(Guid.NewGuid(), "Test Budget", 500m);

        _createUseCaseMock
            .Setup(uc => uc.ExecuteAsync(It.IsAny<CreateBudgetUseCaseInput>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(output);

        // Act
        var result = await _controller.Create(input);

        // Assert
        result.Should().BeOfType<CreatedAtActionResult>();
        var createdResult = result as CreatedAtActionResult;
        createdResult!.ActionName.Should().Be(nameof(BudgetController.GetById));
        createdResult.Value.Should().BeEquivalentTo(output);
    }

    [Fact]
    public async Task GetAll_ShouldReturnOkWithBudgets()
    {
        // Arrange
        var budgets = new List<BudgetDto>
        {
            new(Guid.NewGuid(), Guid.NewGuid(), "Budget 1", 500m, BudgetStatus.Active, DateTime.Now),
            new(Guid.NewGuid(), Guid.NewGuid(), "Budget 2", 1000m, BudgetStatus.Active, DateTime.Now),
        };

        _getAllUseCaseMock
            .Setup(uc => uc.ExecuteAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(budgets);

        // Act
        var result = await _controller.GetAll();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var okResult = result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(budgets);
    }
}
```

## Testing Best Practices

### ✅ DO

- **Test behavior, not implementation** - Test "what" not "how"
- **Use descriptive names** - `it("should create budget when input is valid")`
- **Follow AAA pattern** - Arrange, Act, Assert clearly separated
- **Test edge cases** - Empty inputs, null values, boundary conditions
- **Use mocks/stubs** - Isolate units being tested from dependencies
- **Keep tests focused** - One assertion per test (or closely related)
- **Use helpers** - Create factory functions for test data
- **Test error paths** - Verify exceptions and error handling

### ❌ DON'T

- **Test frameworks** - Don't test React Testing Library or Vitest itself
- **Test external APIs** - Mock HTTP calls, don't hit real servers
- **Test implementation details** - Refactoring shouldn't break tests
- **Create flaky tests** - Use `waitFor`, avoid `setTimeout`
- **Copy-paste test code** - DRY principle applies to tests too
- **Test everything** - Focus on critical business logic
- **Mix concerns** - Unit tests, integration tests, E2E tests should be separate

## Running Tests

### Frontend

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test -- button.test.ts

# Watch mode
npm test -- --watch

# Run E2E tests with Playwright
npm run test:e2e
```

### Backend

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true

# Run specific project
dotnet test ./SmartBudgetPro.Application.Tests

# Run specific test
dotnet test --filter "FullyQualifiedName~BudgetControllerTests"

# Verbose output
dotnet test -v detailed
```

## Test File Organization

```
Frontend:
src/
  components/
    ui/
      button.tsx
      button.test.tsx       # Test adjacent to component
  hooks/
    use-budgets.ts
    use-budgets.test.ts
  lib/
    services/
      budget-service.ts
      budget-service.test.ts
  __tests__/                # Alternative: centralized tests
    components/
    hooks/
    services/

Backend:
src/
  SmartBudgetPro.Domain/
  SmartBudgetPro.Application/
  SmartBudgetPro.Application.Tests/
    UseCases/
      Budgets/
        CreateBudgetUseCaseTests.cs
    Repositories/
      BudgetRepositoryTests.cs
  SmartBudgetPro.API.Tests/
    Controllers/
      BudgetControllerTests.cs
```

## Coverage Goals

- **Line Coverage**: Aim for 70%+
- **Branch Coverage**: Aim for 60%+
- **Focus on**:
  - Business logic (use cases, validators, repositories)
  - Error handling paths
  - Edge cases and boundary conditions
  - Public APIs (controllers, services)

## Example: Test Data Builders

```typescript
// hooks/__tests__/builders/budget-builder.ts
export class BudgetBuilder {
  private budget: Budget = {
    id: "1",
    userId: "user-1",
    name: "Test Budget",
    limitAmount: 1000,
    status: "Active",
    createdAt: new Date().toISOString(),
  }

  withName(name: string): this {
    this.budget.name = name
    return this
  }

  withLimitAmount(amount: number): this {
    this.budget.limitAmount = amount
    return this
  }

  build(): Budget {
    return this.budget
  }
}

// In test file
it("should display budget name", () => {
  const budget = new BudgetBuilder()
    .withName("Monthly Expenses")
    .withLimitAmount(500)
    .build()

  render(<BudgetCard budget={budget} />)
  expect(screen.getByText("Monthly Expenses")).toBeInTheDocument()
})
```

## Continuous Integration

Configure your CI/CD pipeline to:

- Run all tests on pull requests
- Report coverage metrics
- Block merges if tests fail or coverage drops below threshold
- Generate test reports for visibility

Example GitHub Actions:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- --coverage
      - run: dotnet test
```

---
applyTo: "**/*.prompt.md"
---

# Implement Full-Stack Feature

You are implementing a complete feature across the SmartBudget stack (frontend + backend) following Clean Architecture and Next.js patterns.

## Analysis Phase

Before starting, analyze the requirements:

1. **Feature Scope**: What data model is needed? What operations (CRUD)?
2. **User Workflows**: What screens/pages? What data flows from backend to UI?
3. **Data Model**: New entities? Changes to existing schema?
4. **Integration Points**: What APIs need to be created/modified?
5. **Validation Rules**: What business rules must be enforced?
6. **Authentication**: Who can access? Any role-based restrictions?

## Backend Implementation (Clean Architecture)

### 1. Domain Layer - Define Entities & Value Objects

**File**: `backend/src/SmartBudgetPro.Domain/{Feature}/{Entity}.cs`

- Create domain entities with private setters and factory methods
- Encapsulate business logic in the entity
- NO dependencies on infrastructure or external libraries
- Use `private` constructors and parameterless for EF Core

```csharp
public class Budget
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; }
    public decimal LimitAmount { get; private set; }
    public BudgetStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Budget() { } // EF Core

    private Budget(Guid userId, string name, decimal limitAmount)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Name = name;
        LimitAmount = limitAmount;
        Status = BudgetStatus.Active;
        CreatedAt = DateTime.UtcNow;
    }

    public static Budget Create(Guid userId, string name, decimal limitAmount)
    {
        // Validation logic can go here
        if (string.IsNullOrWhiteSpace(name))
            throw new InvalidOperationException("Name is required");
        if (limitAmount <= 0)
            throw new InvalidOperationException("Limit must be positive");

        return new(userId, name, limitAmount);
    }

    public void UpdateLimit(decimal newLimit)
    {
        if (newLimit <= 0)
            throw new InvalidOperationException("Limit must be positive");
        LimitAmount = newLimit;
    }

    public void Deactivate()
    {
        Status = BudgetStatus.Inactive;
    }
}

public enum BudgetStatus
{
    Active,
    Inactive,
    Archived
}
```

### 2. Application Layer - Define Interfaces & DTOs

**Files**:

- `backend/src/SmartBudgetPro.Application/Interfaces/I{Feature}Repository.cs`
- `backend/src/SmartBudgetPro.Application/Common/{Feature}Dto.cs`

```csharp
// Repository Interface
public interface IBudgetRepository
{
    Task AddAsync(Budget budget, CancellationToken cancellationToken = default);
    Task UpdateAsync(Budget budget, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid budgetId, CancellationToken cancellationToken = default);
    Task<Budget?> GetByIdAsync(Guid budgetId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Budget>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}

// DTO
public record BudgetDto(
    Guid Id,
    Guid UserId,
    string Name,
    decimal LimitAmount,
    BudgetStatus Status,
    DateTime CreatedAt
);
```

### 3. Application Layer - Create Use Cases

**Files**:

- `backend/src/SmartBudgetPro.Application/UseCases/Budgets/Create/CreateBudgetUseCase.cs`
- `backend/src/SmartBudgetPro.Application/UseCases/Budgets/Create/CreateBudgetUseCaseInput.cs`
- `backend/src/SmartBudgetPro.Application/UseCases/Budgets/Create/CreateBudgetUseCaseOutput.cs`
- `backend/src/SmartBudgetPro.Application/UseCases/Budgets/Create/CreateBudgetUseCaseInputValidator.cs`

**Pattern**: One use case per operation (Create, Update, Delete, GetById, GetAll, etc.)

```csharp
// Input (immutable record)
public record CreateBudgetUseCaseInput(
    Guid UserId,
    string Name,
    decimal LimitAmount
);

// Output (immutable record)
public record CreateBudgetUseCaseOutput(
    Guid Id,
    string Name,
    decimal LimitAmount
);

// Validator
public class CreateBudgetUseCaseInputValidator : AbstractValidator<CreateBudgetUseCaseInput>
{
    public CreateBudgetUseCaseInputValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Budget name is required")
            .MaximumLength(100).WithMessage("Budget name cannot exceed 100 characters");

        RuleFor(x => x.LimitAmount)
            .GreaterThan(0).WithMessage("Budget limit must be greater than zero");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
    }
}

// Use Case (with constructor dependency injection)
public class CreateBudgetUseCase(
    IBudgetRepository budgetRepository,
    IValidator<CreateBudgetUseCaseInput> validator)
{
    public async Task<CreateBudgetUseCaseOutput> ExecuteAsync(
        CreateBudgetUseCaseInput input,
        CancellationToken cancellationToken = default)
    {
        // Validate input
        await validator.ValidateAndThrowAsync(input, cancellationToken);

        // Create domain entity
        var budget = Budget.Create(input.UserId, input.Name, input.LimitAmount);

        // Persist
        await budgetRepository.AddAsync(budget, cancellationToken);

        // Return output
        return new CreateBudgetUseCaseOutput(
            budget.Id,
            budget.Name,
            budget.LimitAmount
        );
    }
}
```

### 4. Infrastructure Layer - Implement Repository & Entity Mapping

**Files**:

- `backend/src/SmartBudgetPro.Infrastructure/Persistence/Repositories/BudgetRepository.cs`
- `backend/src/SmartBudgetPro.Infrastructure/Persistence/Configurations/BudgetConfiguration.cs` (EF Core mapping)

```csharp
// Repository Implementation
public class BudgetRepository(AppDbContext context) : IBudgetRepository
{
    public async Task AddAsync(Budget budget, CancellationToken cancellationToken = default)
    {
        context.Budgets.Add(budget);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Budget?> GetByIdAsync(Guid budgetId, CancellationToken cancellationToken = default)
    {
        return await context.Budgets
            .FirstOrDefaultAsync(b => b.Id == budgetId, cancellationToken);
    }

    public async Task<IEnumerable<Budget>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await context.Budgets
            .Where(b => b.UserId == userId)
            .ToListAsync(cancellationToken);
    }
}

// Entity Configuration (Fluent API)
public class BudgetConfiguration : IEntityTypeConfiguration<Budget>
{
    public void Configure(EntityTypeBuilder<Budget> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.LimitAmount)
            .HasColumnType("numeric(18,2)");

        builder.Property(x => x.Status)
            .HasConversion<string>();

        builder.HasIndex(x => x.UserId);

        builder.HasData(
            // optional seed data
        );
    }
}
```

### 5. API Layer - Create Controller

**File**: `backend/src/SmartBudgetPro.API/Controllers/BudgetController.cs`

- Constructor inject use cases
- Extract `userId` from JWT token
- Return appropriate HTTP status codes
- Attach `[Authorize]` or `[AllowAnonymous]` attributes

```csharp
[ApiController]
[Route("api/budgets")]
[Authorize]
public class BudgetController(
    CreateBudgetUseCase createUseCase,
    GetAllBudgetsUseCase getAllUseCase,
    GetBudgetByIdUseCase getByIdUseCase,
    UpdateBudgetUseCase updateUseCase,
    DeleteBudgetUseCase deleteUseCase) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBudgetUseCaseInput input)
    {
        var userId = User.GetRequiredUserId();
        var securedInput = input with { UserId = userId };

        var result = await createUseCase.ExecuteAsync(securedInput);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetRequiredUserId();
        var budgets = await getAllUseCase.ExecuteAsync(userId);
        return Ok(budgets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = User.GetRequiredUserId();
        var budget = await getByIdUseCase.ExecuteAsync(userId, id);
        return Ok(budget);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBudgetUseCaseInput input)
    {
        var userId = User.GetRequiredUserId();
        var securedInput = input with { UserId = userId, Id = id };

        await updateUseCase.ExecuteAsync(securedInput);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.GetRequiredUserId();
        await deleteUseCase.ExecuteAsync(new DeleteBudgetUseCaseInput(userId, id));
        return NoContent();
    }
}
```

### 6. Dependency Injection Setup

**File**: `backend/src/SmartBudgetPro.Application/DependencyInjection.cs` (if adding new use cases)

```csharp
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<CreateBudgetUseCase>();
        services.AddScoped<GetAllBudgetsUseCase>();
        services.AddScoped<GetBudgetByIdUseCase>();
        services.AddScoped<UpdateBudgetUseCase>();
        services.AddScoped<DeleteBudgetUseCase>();

        // Register validators
        services.AddValidatorsFromAssemblyContaining<CreateBudgetUseCaseInputValidator>();

        return services;
    }
}
```

### 7. Database Migration

```bash
cd backend/src/SmartBudgetPro.API
dotnet ef migrations add AddBudgets
dotnet ef database update
```

---

## Frontend Implementation (Next.js + React)

### 1. Define Types

**File**: `frontend/types/budget.ts`

```typescript
export interface Budget {
  id: string;
  userId: string;
  name: string;
  limitAmount: number;
  status: "Active" | "Inactive" | "Archived";
  createdAt: string;
}

export interface CreateBudgetInput {
  name: string;
  limitAmount: number;
}
```

### 2. Create API Client/Service

**File**: `frontend/lib/services/budget-service.ts`

```typescript
import { api } from "@/lib/axios";
import { Budget, CreateBudgetInput } from "@/types/budget";

export const budgetService = {
  async create(input: CreateBudgetInput): Promise<Budget> {
    const response = await api.post("/budgets", input);
    return response.data;
  },

  async getAll(): Promise<Budget[]> {
    const response = await api.get("/budgets");
    return response.data;
  },

  async getById(id: string): Promise<Budget> {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  async update(id: string, input: Partial<CreateBudgetInput>): Promise<void> {
    await api.put(`/budgets/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};
```

### 3. Create Custom Hooks (React Query)

**File**: `frontend/hooks/use-budgets.ts`

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "@/lib/services/budget-service";
import { Budget, CreateBudgetInput } from "@/types/budget";
import { toast } from "sonner";

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => budgetService.getAll(),
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: ["budgets", id],
    queryFn: () => budgetService.getById(id),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBudgetInput) => budgetService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget created successfully");
    },
    onError: () => {
      toast.error("Failed to create budget");
    },
  });
}

export function useUpdateBudget(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<CreateBudgetInput>) =>
      budgetService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", id] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget updated successfully");
    },
    onError: () => {
      toast.error("Failed to update budget");
    },
  });
}

export function useDeleteBudget(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => budgetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete budget");
    },
  });
}
```

### 4. Create Forms with React Hook Form + Zod

**File**: `frontend/components/budget-form.tsx`

```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateBudget } from "@/hooks/use-budgets"

const budgetFormSchema = z.object({
  name: z.string().min(1, "Budget name is required").max(100),
  limitAmount: z.number().min(0.01, "Limit must be greater than zero"),
})

type BudgetFormValues = z.infer<typeof budgetFormSchema>

interface BudgetFormProps {
  onSuccess?: () => void
}

export function BudgetForm({ onSuccess }: BudgetFormProps) {
  const { mutate: create, isPending } = useCreateBudget()
  const { register, handleSubmit, formState: { errors } } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
  })

  const onSubmit = (data: BudgetFormValues) => {
    create(data, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Budget Name</Label>
        <Input
          id="name"
          placeholder="Enter budget name"
          {...register("name")}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>

      <div>
        <Label htmlFor="limitAmount">Limit Amount</Label>
        <Input
          id="limitAmount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("limitAmount", { valueAsNumber: true })}
        />
        {errors.limitAmount && <span className="text-red-500 text-sm">{errors.limitAmount.message}</span>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Budget"}
      </Button>
    </form>
  )
}
```

### 5. Create Page Component

**File**: `frontend/app/(app)/budgets/page.tsx`

```typescript
import { BudgetForm } from "@/components/budget-form"
import { BudgetList } from "@/components/budget-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budgets</h1>
        <p className="text-gray-600">Manage your spending budgets</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 6. Create List/Display Component

**File**: `frontend/components/budget-list.tsx`

```typescript
"use client"

import { useBudgets } from "@/hooks/use-budgets"
import { BudgetCard } from "@/components/budget-card"
import { Skeleton } from "@/components/ui/skeleton"

export function BudgetList() {
  const { data: budgets, isLoading, isError } = useBudgets()

  if (isLoading) {
    return <div className="space-y-2">{Array(3).fill(null).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
  }

  if (isError) {
    return <p className="text-red-500">Failed to load budgets</p>
  }

  if (!budgets?.length) {
    return <p className="text-gray-500">No budgets yet. Create your first one!</p>
  }

  return (
    <div className="space-y-3">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  )
}
```

### 7. Create Detail/Card Component

**File**: `frontend/components/budget-card.tsx`

```typescript
"use client"

import { Budget } from "@/types/budget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDeleteBudget } from "@/hooks/use-budgets"

interface BudgetCardProps {
  budget: Budget
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const { mutate: delete_, isPending } = useDeleteBudget(budget.id)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{budget.name}</CardTitle>
          <Badge variant={budget.status === "Active" ? "default" : "secondary"}>
            {budget.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Limit</p>
          <p className="text-2xl font-bold">${budget.limitAmount.toFixed(2)}</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          disabled={isPending}
          onClick={() => delete_()}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## Integration Checklist

### Backend

- [ ] Domain entity created with encapsulation
- [ ] Use cases implemented with validators
- [ ] Repository interface & implementation
- [ ] EF Core configuration & migration
- [ ] Controller endpoints with auth checks
- [ ] DI registration in Program.cs
- [ ] Database migration applied
- [ ] API tested with Postman/Thunder Client

### Frontend

- [ ] Types defined
- [ ] API service created
- [ ] React Query hooks implemented
- [ ] Form component with Zod validation
- [ ] List/display components
- [ ] Page component created
- [ ] Navigation updated to include new feature
- [ ] Tested in browser

### Testing

- [ ] Backend: Unit tests for use cases
- [ ] Backend: Integration tests for controllers
- [ ] Frontend: Component tests with Vitest
- [ ] Frontend: E2E tests with Playwright

---

## Notes

- Always validate on both frontend (Zod) and backend (FluentValidation)
- Use ownership checks: `if (resource.UserId != userId) throw new UnauthorizedAccessException()`
- Keep components focused and composable
- Use React Query for caching and synchronization
- Include error handling and loading states
- Test error scenarios (network failures, validation errors, etc.)

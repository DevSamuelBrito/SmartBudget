# GitHub Copilot Instructions - SmartBudget

## Stack Técnico

**Backend:**

- .NET 9 with C# (latest features)
- ASP.NET Core REST API
- Entity Framework Core with PostgreSQL
- FluentValidation for input validation
- JWT for authentication
- Clean Architecture pattern (Domain → Application → Infrastructure → API)

**Frontend:**

- Next.js 16.1.6 with React 19.2.3
- TypeScript with strict mode enabled
- Tailwind CSS 4 + shadcn/ui component library
- React Hook Form + Zod for form validation
- TanStack React Query for server state management
- Recharts for data visualization
- Axios for HTTP requests

## Folder Structure & File Organization

### Backend Structure (Clean Architecture)

```
backend/src/
├── SmartBudgetPro.Domain/          # Business rules & entities
│   ├── Users/
│   ├── Budgets/
│   ├── FinancialTransactions/
│   └── Dashboard/
├── SmartBudgetPro.Application/     # Use cases & interfaces
│   ├── UseCases/{Entity}/{Action}/
│   │   ├── {Action}UseCase.cs
│   │   ├── {Action}UseCaseInput.cs (record)
│   │   ├── {Action}UseCaseOutput.cs (record)
│   │   └── {Action}UseCaseInputValidator.cs
│   ├── Interfaces/                 # Contracts & abstractions
│   ├── Common/                     # Shared DTOs & exceptions
│   └── TransactionCategory/
├── SmartBudgetPro.Infrastructure/  # Implementations
│   ├── Persistence/
│   │   ├── Repositories/
│   │   └── AppDbContext.cs
│   └── Security/
└── SmartBudgetPro.API/             # Controllers & config
    ├── Controllers/
    ├── Configuration/
    ├── Middlewares/ExceptionHandlingMiddleware.cs
    └── Extensions/
```

### Frontend Structure (Next.js App Router)

````
frontend/
├── app/
│   ├── (auth)/layout.tsx           # Auth routes (login, register)
│   ├── (app)/layout.tsx            # Protected app routes
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   └── categories/
│   ├── actions/                    # Server Actions
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                         # shadcn/ui base components
│   ├── shared/                     # Reusable domain-agnostic components
│   ├── domain/                     # Feature-specific components
│   ├── auth-*.tsx                  # Auth-related components
│   └── *-form.tsx                  # Form components
├── contexts/                       # React Context (auth)
├── hooks/                          # Custom React hooks (use-*.ts)
├── lib/
│   ├── utils.ts                    # Utility functions (cn, formatting)
│   ├── axios.ts                    # HTTP client configuration
│   ├── auth.ts                     # Auth utilities
│   └── utils/                      # Organized utilities
├── providers/                      # Provider components (ThemeProvider, etc)
├── types/                          # TypeScript types & interfaces
├── constants/                      # Constants & mock data
└── public/                         # Static assets

## Naming Conventions

### Backend (C#)
- **Classes**: `PascalCase` (e.g., `BudgetController`, `CreateUserUseCase`)
- **Methods/Properties**: `PascalCase` (e.g., `ExecuteAsync`, `GetByIdAsync`)
- **Interfaces**: `IPrefixName` (e.g., `IBudgetRepository`, `IPasswordHasher`)
- **Exceptions**: `PascalCaseException` (e.g., `UserNotFoundException`)
- **DTOs**: `PascalCaseDto` (e.g., `BudgetDto`, `UserLoginDto`)
- **Private fields**: `_camelCase` or use properties directly
- **Constants**: `UPPER_SNAKE_CASE`
- **Async methods**: Always `*Async` suffix (e.g., `GetByIdAsync`, `CreateAsync`)

### Frontend (TypeScript)
- **Components**: `PascalCase` files with `.tsx` (e.g., `LoginForm.tsx`, `DataTable.tsx`)
- **Hooks**: `use-kebab-case.ts` files, function `useCamelCase` (e.g., `useAuth`, `useCategories`)
- **Types/Interfaces**: `PascalCase` (e.g., `LoginFormValues`, `UserProfile`)
- **Utility functions**: `camelCase` (e.g., `cn()`, `formatCurrency()`)
- **Constants**: `UPPER_SNAKE_CASE` in `constants/mock.ts`
- **Other files**: `kebab-case` (e.g., `auth-context.tsx`, `month-year-selector.tsx`)

## Code Patterns

### Backend Patterns

**Domain Entity Pattern:**
- Entities are rich objects with private setters and factory methods
- Use `private` constructors with parameterless constructor for EF Core
- Expose factory methods: `User.Create(email, hashedPassword)`
- Use records for immutable DTOs and Use Case inputs/outputs

```csharp
public class Budget
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public decimal LimitAmount { get; private set; }
    public BudgetStatus Status { get; private set; }

    private Budget() { } // EF Core

    private Budget(Guid userId, decimal limitAmount)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        LimitAmount = limitAmount;
        Status = BudgetStatus.Active;
    }

    public static Budget Create(Guid userId, decimal limitAmount)
        => new(userId, limitAmount);
}
````

**Use Case Pattern:**

- Constructor injection of dependencies (repositories, validators, etc)
- Async method `ExecuteAsync(Input): Task<Output>`
- Input/Output are records for immutability
- Validator is injected and called before business logic

```csharp
public class CreateBudgetUseCase
{
    public CreateBudgetUseCase(
        IBudgetRepository budgetRepository,
        IValidator<CreateBudgetUseCaseInput> validator)
    {
        _budgetRepository = budgetRepository;
        _validator = validator;
    }

    public async Task<BudgetDto> ExecuteAsync(CreateBudgetUseCaseInput input)
    {
        await _validator.ValidateAndThrowAsync(input);

        var budget = Budget.Create(input.UserId, input.LimitAmount);
        await _budgetRepository.AddAsync(budget);

        return new BudgetDto(budget.Id, budget.UserId, ...);
    }
}
```

**Controller Pattern:**

- Constructor injection of Use Cases
- Methods return `IActionResult` (Ok, BadRequest, etc)
- Extract userId from JWT: `var userId = User.GetRequiredUserId();`
- Use `[Authorize]` and `[AllowAnonymous]` attributes

```csharp
[ApiController]
[Route("api/budgets")]
[Authorize]
public class BudgetController : ControllerBase
{
    public BudgetController(
        GetAllBudgetsUseCase getAllUseCase,
        CreateBudgetUseCase createUseCase)
    {
        _getAllUseCase = getAllUseCase;
        _createUseCase = createUseCase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetRequiredUserId();
        var budgets = await _getAllUseCase.ExecuteAsync(userId);
        return Ok(budgets);
    }
}
```

**Validation Pattern:**

- Use FluentValidation with `AbstractValidator<T>`
- Rules are fluent and chainable
- Validators are auto-registered in DI

```csharp
public class CreateBudgetUseCaseInputValidator : AbstractValidator<CreateBudgetUseCaseInput>
{
    public CreateBudgetUseCaseInputValidator()
    {
        RuleFor(x => x.LimitAmount)
            .GreaterThan(0).WithMessage("Limit must be positive");
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name is too long");
    }
}
```

### Frontend Patterns

**Functional Components with TypeScript:**

- All components are functional, no class components
- Props typed with `React.ComponentProps<ElementType>`
- Use `"use client"` directive when client-side interactivity is needed

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 font-medium rounded-md transition-colors",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "outline" && "border border-gray-300 hover:bg-gray-50",
        size === "lg" && "px-6 py-3",
        className
      )}
      {...props}
    />
  )
)
Button.displayName = "Button"
```

**React Hook Form + Zod Pattern:**

- Define Zod schema separate from component
- Use `useForm` with `zodResolver`
- Handle submission with `handleSubmit`

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ chars"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    const result = await loginAction(data)
    if (result.success) {
      // handle success
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  )
}
```

**React Query Pattern:**

- Use `useQuery` for fetching data
- Use `useMutation` for mutations
- Queries are keyed by resource + params

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";

export function useBudgets(userId: string) {
  return useQuery({
    queryKey: ["budgets", userId],
    queryFn: () => api.get(`/budgets?userId=${userId}`),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetInput) => api.post("/budgets", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}
```

**Context Pattern (Auth):**

- Single context for auth state + user
- Dispatch-based reducer pattern for state updates
- Provide through global provider

```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAction({ email, password })
    if (result.success) {
      dispatch({ type: "LOGIN", payload: result.user })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Import/Export Conventions

### Backend (C#)

- Group usings by: System → Microsoft → SmartBudgetPro (by layer)
- Use namespace aliases for conflict resolution: `using DomainBudget = SmartBudgetPro.Domain.Budgets.Budget;`
- Public methods/classes unless explicitly internal

### Frontend (TypeScript)

- Import order: React → External libs → Local utils/types → Components/Contexts
- Use `@/` alias for absolute imports (configured in `tsconfig.json`)
- Named exports for utilities and components; default export optional
- Group imports by category
- Add a blank line between import groups
- Add a comment above each import group indicating its category (`react`, `next`, `external`, `utils`, `types`, `components`, `contexts`, etc.)

```
// react
import*asReactfrom"react";

// next
import {useRouter }from"next/navigation";

// react-query
import {useQuery }from"@tanstack/react-query";

// react-hook-form
import {useForm }from"react-hook-form";

// zod
import {z }from"zod";

// utils
import {cn }from"@/lib/utils";

// types
import {UserProfile }from"@/types/user";

// components
import {Button }from"@/components/ui/button";

// contexts
import {useAuth }from"@/contexts/auth-context";
```

## Error Handling

### Backend

- **Exception Hierarchy**: `BusinessException` as base for domain errors
- **Specific Exceptions**: `InvalidCredentialsException`, `UserNotFoundException`, etc.
- **HTTP Status Codes**: Mapped in `ExceptionHandlingMiddleware`
  - 400: Validation/Bad Request
  - 401: Unauthorized (invalid credentials)
  - 403: Forbidden (access denied)
  - 404: Not Found
  - 409: Conflict (duplicate email, etc)
  - 500: Unexpected errors
- **Validation**: FluentValidation exceptions caught and mapped to 400
- **Pattern**: Try-validate-throw in Use Cases, caught centrally

```csharp
public class ExceptionHandlingMiddleware
{
    private static (int StatusCode, string Message) MapException(Exception ex) =>
        ex switch {
            BusinessException businessEx => (businessEx.StatusCode, businessEx.Message),
            ValidationException validationEx => (400, FormatErrors(validationEx)),
            UnauthorizedAccessException => (401, "Unauthorized"),
            _ => (500, "Internal server error")
        };
}
```

### Frontend

- **Pattern**: Result<T> with `{ success: boolean, data?: T, error?: string }`
- **Server Actions**: Return typed result objects
- **Components**: Use toast notifications for errors (Sonner integration)
- **Network Errors**: Axios interceptor handles 401 → logout
- **Validation**: Zod schema validation before submission

```typescript
export async function loginAction(
  input: LoginInput,
): Promise<Result<AuthUser>> {
  try {
    const response = await api.post("/auth/login", input);
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error);
    return { success: false, error: message };
  }
}
```

## Security Best Practices

- **Authentication**: JWT tokens in HttpOnly cookies
- **Authorization**: `[Authorize]` on protected endpoints, role-based checks
- **Email Normalization**: Always `.Trim().ToLowerInvariant()` before comparison
- **Password Hashing**: Use secure hash + salt (never plain text)
- **CORS**: Configured for `localhost:3000` in development
- **Ownership Checks**: Verify `userId` from token matches resource owner
- **Validation**: Always validate input before processing
- **Secrets**: Never commit API keys, use environment variables

## TypeScript Configuration

- `strict: true` - Enable all type checking options
- `skipLibCheck: true` - Skip type checking of declaration files
- `esModuleInterop: true` - Enable ES module interop
- `moduleResolution: "bundler"` - Modern module resolution
- `paths: { "@/*": ["./*"] }` - Absolute imports with @ alias

## Additional Patterns

**Data Pagination:**

- Use `PagedResult<T>` with `items`, `totalCount`, `page`, `pageSize`, `hasNextPage`
- Backend returns paginated responses, frontend handles via query params

**Data Transfer Objects (DTOs):**

- Used to transfer data between layers
- Often records for immutability: `public record BudgetDto(Guid Id, decimal Limit);`

**Component Composition:**

- Use `cn()` utility to merge Tailwind classes
- Spread `...props` for extensibility
- Use `forwardRef` for components that need ref access

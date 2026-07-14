# SmartBudget — Claude Instructions

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

## Folder Structure

### Backend (Clean Architecture)

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
│   ├── Interfaces/
│   ├── Common/
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

### Frontend (Next.js App Router)

```
frontend/
├── app/[locale]/
│   ├── (auth)/layout.tsx           # Auth routes (login, register)
│   ├── (app)/layout.tsx            # Protected app routes
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   └── categories/
│   ├── actions/                    # Server Actions
│   └── layout.tsx
├── components/
│   ├── ui/                         # shadcn/ui base components
│   ├── shared/                     # Reusable domain-agnostic components
│   ├── domain/                     # Feature-specific components
│   └── auth-*.tsx
├── contexts/                       # React Context (auth)
├── hooks/                          # Custom React hooks (use-*.ts)
├── lib/
│   ├── utils.ts
│   ├── axios.ts
│   └── auth.ts
├── messages/                       # i18n translations (en.json, pt-BR.json)
├── providers/
├── types/
└── constants/
```

## Naming Conventions

### Backend (C#)
- Classes: `PascalCase`
- Methods/Properties: `PascalCase`
- Interfaces: `IPrefixName`
- Exceptions: `PascalCaseException`
- DTOs: `PascalCaseDto`
- Private fields: `_camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Async methods: always `*Async` suffix

### Frontend (TypeScript)
- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`, function `useCamelCase`
- Types/Interfaces: `PascalCase`
- Utility functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Other files: `kebab-case`

## Code Patterns

### Backend

**Domain Entity:** private setters, private constructor (EF Core), factory method `Entity.Create(...)`.

**Use Case:** constructor injection, `ExecuteAsync(Input): Task<Output>`, records for Input/Output, FluentValidation injected and called first.

**Controller:** thin — inject use cases, extract userId via `User.GetRequiredUserId()`, delegate, return HTTP result. No business logic.

**Validation:** `AbstractValidator<T>` with FluentValidation, auto-registered in DI.

### Frontend

**Import order** (always, with label comment and blank line between groups):
```
// react
// next
// react-query / react-hook-form / zod / [lib]
// components
// hooks
// apis / services
// types
// utils
```

**Components:** functional only, `"use client"` only when needed (state/effects/hooks), extend HTML element props, use `cn()` for class merging, `React.forwardRef` when ref access needed.

**Data fetching:** `useQuery` / `useMutation` via TanStack Query — never `fetch()` directly in client components.

**Forms:** Zod schema → `useForm` with `zodResolver` → `handleSubmit`.

**Auth context:** `useReducer`-based, dispatch actions, single global provider.

## Error Handling

### Backend
- Exception hierarchy: `BusinessException` as base for domain errors
- HTTP mapping in `ExceptionHandlingMiddleware`: 400/401/403/404/409/500
- FluentValidation exceptions → 400

### Frontend
- Pattern: `Result<T>` with `{ success: boolean, data?: T, error?: string }`
- Server Actions return typed result objects
- Toast notifications via Sonner for user-facing errors
- Axios interceptor: 401 → logout

## Security
- JWT tokens in HttpOnly cookies
- `[Authorize]` on protected endpoints
- Email: always `.Trim().ToLowerInvariant()` before comparison
- Passwords: secure hash + salt
- Ownership checks: verify `userId` from token matches resource
- Always validate input before processing
- Never commit secrets — use environment variables

## Testing

**Frontend:** Vitest + React Testing Library + Playwright (E2E).
**Backend:** xUnit + Moq + FluentAssertions.

Pattern: `describe` → `it` → Arrange / Act / Assert. Test behavior, not implementation. Mock external dependencies.

### Running tests

```bash
# Frontend
npm test
npm test -- --coverage
npm run test:e2e

# Backend
dotnet test
dotnet test /p:CollectCoverage=true
dotnet test --filter "FullyQualifiedName~BudgetControllerTests"
```

### Coverage goals
- Line: 70%+
- Branch: 60%+
- Focus: business logic, error paths, public APIs

## Custom Slash Commands

- `/backend` — implementar/revisar backend C#/.NET Clean Architecture
- `/frontend` — implementar/revisar frontend Next.js
- `/fullstack` — orquestrar feature ponta a ponta
- `/new-component` — criar novo componente React
- `/new-feature` — implementar feature full-stack
- `/caveman` — modo comunicação ultra-comprimido
- `/grill-me` — entrevista relentless sobre plano/design

## Design Context

`PRODUCT.md` and `DESIGN.md` at the project root carry strategic and visual design context for `/impeccable` commands. `PRODUCT.md` splits register by surface: the public landing page is brand register (marketing-led, conversion-focused), while the authenticated app (dashboard, transactions, budgets, reports) stays product register. `DESIGN.md` documents the existing flat, single-accent ("Quiet Confidence" / Growth Green) visual system extracted from the current codebase. Read both before design work on either surface.

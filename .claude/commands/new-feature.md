# Implementar Feature Full-Stack

Implemente uma feature completa no SmartBudget (frontend + backend) seguindo Clean Architecture e Next.js patterns.

## Análise Inicial

1. **Escopo**: Qual modelo de dados? Quais operações (CRUD)?
2. **Fluxos**: Quais telas/páginas? Como os dados fluem do backend para UI?
3. **Modelo de dados**: Entidades novas? Mudanças no schema?
4. **Pontos de integração**: APIs a criar/modificar?
5. **Regras de validação**: Quais regras de negócio?
6. **Autenticação**: Quem pode acessar? Role-based?

## Backend (Clean Architecture)

### 1. Domain — Entidades

`backend/src/SmartBudgetPro.Domain/{Feature}/{Entity}.cs`

- Private setters, private constructor (EF Core), factory method `Entity.Create(...)`.
- Lógica de negócio encapsulada na entidade.
- Sem dependências de infrastructure.

### 2. Application — Interfaces & DTOs

- `Interfaces/I{Feature}Repository.cs`
- `Common/{Feature}Dto.cs` (record imutável)

### 3. Application — Use Cases

Por operação: `UseCases/{Entity}/{Action}/{Action}UseCase.cs` + `Input.cs` + `Output.cs` + `InputValidator.cs`

Padrão: `ExecuteAsync(Input, CancellationToken): Task<Output>`.

### 4. Infrastructure — Repositório & Mapping

- `Persistence/Repositories/{Feature}Repository.cs`
- `Persistence/Configurations/{Entity}Configuration.cs` (Fluent API)

### 5. API — Controller

`API/Controllers/{Feature}Controller.cs` — fino, injeta use cases, extrai userId do JWT, retorna HTTP apropriado.

### 6. DI & Migration

Registrar em `DependencyInjection.cs` por camada. Criar migration EF Core.

## Frontend (Next.js)

### 1. Types

`frontend/types/{feature}.ts` — alinhados ao response do backend.

### 2. Service

`frontend/lib/services/{feature}-service.ts` — chamadas HTTP via axios.

### 3. Hooks (React Query)

`frontend/hooks/use-{feature}.ts` — `useQuery` / `useMutation`, invalidação de cache, toasts.

### 4. Schema

Zod schema para validação de formulários.

### 5. Components

Componentes da feature em `app/[locale]/(app)/{feature}/components/`.

### 6. Page

`app/[locale]/(app)/{feature}/page.tsx` — Server Component → passa dados para Screen client.

## Checklist de Consistência

### Backend
- [ ] Entidade de domínio com encapsulamento
- [ ] Use cases com validators
- [ ] Repository interface & implementação
- [ ] EF Core config & migration
- [ ] Controller com auth checks
- [ ] DI registrada

### Frontend
- [ ] Types definidos
- [ ] Service criado
- [ ] Hooks React Query implementados
- [ ] Form com Zod validation
- [ ] Componentes de lista/detalhe
- [ ] Page criada

### Testes
- [ ] Backend: unit tests dos use cases
- [ ] Frontend: component tests com Vitest

---

$ARGUMENTS

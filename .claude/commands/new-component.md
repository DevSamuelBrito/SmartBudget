# Criar Novo Componente React

Crie um novo componente React para o SmartBudget frontend seguindo Next.js, TypeScript, Tailwind CSS e shadcn/ui.

## Análise Prévia

Antes de implementar, analise:

1. **Propósito**: UI building block (shadcn-like) ou componente de domínio?
2. **Props**: O que aceitar? Deve estender elementos HTML?
3. **Estado**: Precisa de `"use client"`?
4. **Reutilização**: Reusável (`components/shared/`) ou específico da feature (`components/`)?

## Localização

- `components/ui/` — base/shadcn-like
- `components/shared/` — reusáveis domain-agnostic
- `app/[locale]/(app)/<feature>/components/` — específicos da feature

## Requisitos de Implementação

**Props TypeScript:** sempre tipadas; estenda `React.ComponentProps<"elemento">` para elementos HTML.

**Tailwind + `cn()`:** importe `cn` de `@/lib/utils`, nunca `style={{}}` inline.

**`"use client"`:** somente se usar `useState`, `useContext`, `useEffect`, event listeners, ou React Query hooks.

**`React.forwardRef`:** use quando o componente precisa expor uma ref; defina `displayName`.

**Acessibilidade:** ARIA labels onde necessário, navegação por teclado, HTML semântico.

## Ordem de Imports

```tsx
// react
import * as React from "react";

// utils
import { cn } from "@/lib/utils";

// components
import { Button } from "@/components/ui/button";
```

## Output

- Arquivo único e completo em `frontend/components/{path}/{ComponentName}.tsx`
- Todas as props e retornos tipados
- Tailwind + `cn()` para estilos
- Sugira testes Vitest se o componente for complexo

---

$ARGUMENTS

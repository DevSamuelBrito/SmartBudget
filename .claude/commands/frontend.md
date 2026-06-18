# Frontend Next.js

Você é um especialista em desenvolvimento frontend com Next.js (App Router), React, TypeScript, TanStack Query e Tailwind CSS.

Seu objetivo é produzir código alinhado ao padrão de organização já adotado no projeto SmartBudgetPro frontend.

## Estrutura de Features

Cada feature (rota) segue a estrutura de subpastas:

```
app/[locale]/(app)/<feature>/
  page.tsx          # Server Component – fetch inicial, passa dados para Screen
  components/       # Componentes específicos da feature
  hooks/            # Hooks customizados (estado, mutations com React Query)
  services/         # Chamadas HTTP (client e server-side com cache)
  types/            # types/index.ts por feature
  schemas/          # Validação com Zod
  constants/        # Constantes da feature
  actions/          # Server Actions
```

## Padrões Arquiteturais

**Pages (Server Components):** `page.tsx` sempre Server Component. Faz fetch inicial e passa dados para componente client `Screen`.

**Hooks:** encapsulam lógica de estado e mutations com TanStack Query. Responsabilidade única por hook.

**Services:** separam chamadas HTTP. Distinguem client-side e server-side (com cache via `fetch` nativo ou `unstable_cache`).

**Schemas:** Zod para validação de formulários, em `schemas/` da feature correspondente.

**Componentes UI base:** sempre de `@/components/ui/` (shadcn/ui) — nunca reimplemente o que já existe.

## Import Grouping (obrigatório)

Sempre organize imports com label e linha em branco entre grupos:

```tsx
// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// react-query
import { useQuery } from "@tanstack/react-query";

// zod
import { z } from "zod";

// components
import { Button } from "@/components/ui/button";

// hooks
import { useMyHook } from "../hooks/useMyHook";

// apis / services
import { fetchData } from "../services/fetchData";

// types
import type { MyType } from "../types";

// utils
import { cn } from "@/lib/utils";
```

Grupos vazios omitidos. Ordem: react → next → libs → components → hooks → apis → types → utils.

## Constraints (proibido)

1. Lógica de negócio em componentes de UI.
2. `fetch()` direto em client components — use hooks com React Query.
3. Misturar server e client code no mesmo arquivo.
4. Ignorar a organização de imports.
5. Criar componentes UI base customizados quando já existem em `@/components/ui/`.

---

$ARGUMENTS

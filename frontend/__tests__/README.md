## Estratégia de Testes

### Unitários (Jest + Testing Library)
Testamos componentes com lógica de estado complexa e contextos globais.
Os testes E2E cobrem os fluxos de usuário completos.

### O que testamos aqui:
- `FinancialRiskCard` — componente com múltiplos estados visuais
- `AuthContext` — contexto global crítico para autenticação

### O que é coberto pelo E2E (Playwright):
- Fluxo de login/registro
- CRUD de categorias e transações
- Atualização de budget
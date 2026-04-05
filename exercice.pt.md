## 🎯 Objetivo do Sistema

Desenvolver um sistema web de controle financeiro pessoal com foco em:

- Controle de orçamento mensal por categoria
- Monitoramento automático de limites
- Suporte a transações recorrentes
- Relatórios mensais consolidados
- Alertas inteligentes de risco financeiro

O sistema deve priorizar regras de negócio claras e consistência financeira.

---

# 👤 PERFIL DO USUÁRIO

Usuário comum que deseja:

- Registrar receitas e despesas
- Definir limites mensais por categoria
- Acompanhar se está ultrapassando o orçamento
- Visualizar resumo financeiro do mês

Sem multiusuário por enquanto (escopo controlado).

---

# 📦 FUNCIONALIDADES OBRIGATÓRIAS (MVP)

---

## 1️⃣ Cadastro de Transação

### Regras:

- Toda transação deve ter:
    - Descrição
    - Valor (maior que 0)
    - Data
    - Tipo (Income | Expense | Transfer)
- Se for Expense:
    - Categoria é obrigatória
- Se for Income:
    - Categoria é opcional
- Transfer:
    - Não entra no cálculo de orçamento
- Valor não pode ser negativo

---

## 2️⃣ Transações Recorrentes

### Regras:

- Usuário pode marcar uma transação como:
    - Recorrente mensal
- O sistema deve:
    - Gerar automaticamente nova transação no mês seguinte
- Não pode duplicar transação já gerada

Isso já exige regra de domínio interessante.

---

## 3️⃣ Orçamento Mensal por Categoria

Usuário pode criar orçamento para uma categoria específica.

### Regras:

- Orçamento é definido por:
    - Categoria
    - Mês/Ano
    - Valor limite
- Só pode existir 1 orçamento por categoria por mês
- Status do orçamento deve ser automático:

| Percentual gasto | Status |
| --- | --- |
| < 80% | OK |
| >= 80% | Warning |
| >= 100% | Exceeded |

Status não pode ser setado manualmente.

---

## 4️⃣ Relatório Mensal

Deve exibir:

- Total de receitas
- Total de despesas
- Saldo do mês
- Lista de categorias com:
    - Valor gasto
    - Orçamento
    - Status

---

# 🧠 REGRAS IMPORTANTES (para forçar modelagem correta)

### ❗ Uma transação não pode alterar diretamente o orçamento.

O orçamento deve recalcular seu status baseado nas transações existentes.

Isso força:

- Domain Service
    
    ou
    
- Regra dentro da entidade Budget

---

### ❗ Se orçamento estiver Exceeded:

- Sistema deve permitir continuar cadastrando
- Mas deve sinalizar no relatório

---

### ❗ Exclusão de transação deve recalcular orçamento

Isso cria regra interessante de consistência.

---

# 🏗 REQUISITOS TÉCNICOS

## Backend:

- ASP.NET
- Clean Architecture
- EF Core na Infrastructure
- Interfaces na Application

## Frontend:

- Next.js
- Separar:
    - Services
    - Hooks
    - Components

---

# 🧠 OPORTUNIDADES DE APLICAR SOLID

## SRP

- Controller só recebe HTTP
- UseCase executa ação
- Entity mantém regra

## OCP

- Cálculo de status pode virar Strategy
- Tipo de transação pode crescer

## LSP

- Se usar herança para transações
- Cuidado com contrato

## ISP

- Interfaces específicas por necessidade

## DIP

- Repositório definido na Application

---

# 🔥 EXTRA (para deixar nível sênior)

Adicionar:

### 📊 Política de economia recomendada

Se gasto fixo mensal > 70% da renda média dos últimos 3 meses:

Status geral do usuário → "Financial Risk"

Isso exige:

- Cálculo estatístico
- Agregação
- Domain Service

---

# 📂 O QUE EU ESPERO COMO “CLIENTE”

- Sistema consistente
- Regras centralizadas
- Código organizado
- README explicando arquitetura
- Diagrama simples das camadas
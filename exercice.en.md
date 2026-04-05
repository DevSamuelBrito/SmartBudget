## 🎯 System Objective

Develop a web-based personal financial control system focused on:

- Monthly budget control by category
- Automatic limit monitoring
- Support for recurring transactions
- Consolidated monthly reports
- Intelligent financial risk alerts

The system should prioritize clear business rules and financial consistency.

---

# 👤 USER PROFILE

A ​​typical user who wants to:

- Record income and expenses
- Set monthly limits by category
- Track whether they are exceeding their budget
- View a monthly financial summary

No multi-user support for now (controlled scope).

---

# 📦 MANDATORY FEATURES (MVP)

---

## 1️⃣ Transaction Registration

### Rules:

- Every transaction must have:

- Description

- Value (greater than 0)

- Date

- Type (Income | Expense | Transfer)

- If Expense:

- Category is mandatory
- If Income:

- Category is optional
- Transfer:

- Not included in budget calculation
- Value cannot be negative

---

## 2️⃣ Recurring Transactions

### Rules:

- User can mark a transaction as:

- Monthly recurring
- The system must:

- Automatically generate a new transaction in the following month
- Cannot duplicate a transaction already generated

This already requires an interesting domain rule.

---

## 3️⃣ Monthly Budget by Category

Users can create a budget for a specific category.

### Rules:

- Budget is defined by:

- Category

- Month/Year

- Limit amount
- Only 1 budget per category per month
- Budget status should be automatic:

| Percentage spent | Status |

| --- | --- |

| < 80% | OK |

| >= 80% | Warning |

| >= 100% | Exceeded |

Status cannot be set manually.

---

## 4️⃣ Monthly Report

Should display:

- Total revenue
- Total expenses
- Monthly balance
- List of categories with:

- Amount spent

- Budget

- Status

---

# 🧠 IMPORTANT RULES (to enforce correct modeling)

### ❗ A transaction cannot directly alter the budget.

The budget must recalculate its status based on existing transactions.

This enforces:

- Domain Service

or

- Rule within the Budget entity

---

### ❗ If budget is Exceeded:

- System should allow continued registration
- But should flag it in the report

---

### ❗ Deleting a transaction should recalculate the budget

This creates an interesting consistency rule.

---

# 🏗 TECHNICAL REQUIREMENTS

## Backend:

- ASP.NET
- Clean Architecture
- EF Core in Infrastructure
- Interfaces in Application

## Frontend:

- Next.js
- Separate:

- Services

- Hooks

- Components

---

# 🧠 OPPORTUNITIES TO APPLY SOLID

## SRP

- Controller only receives HTTP
- UseCase executes action
- Entity maintains rule

## OCP

- Status calculation can become Strategy
- Transaction type can grow

## LSP

- If using inheritance for transactions
- Be careful with the contract

## ISP

- Specific interfaces as needed

## DIP

- Repository defined in Application

---

# 🔥 EXTRA (to reach senior level)

Add:

### 📊 Savings Policy Recommended

If monthly fixed expenses > 70% of average income over the last 3 months:

General user status → "Financial Risk"

This requires:

- Statistical calculation
- Aggregation
- Domain Service

---

# 📂 WHAT I EXPECT AS A "CLIENT"

- Consistent system
- Centralized rules
- Organized code
- README explaining architecture
- Simple layer diagram
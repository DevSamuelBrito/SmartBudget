# SmartBudget

[PT-BR version](README.pt-BR.md)

SmartBudget is a full-stack personal finance project under active development, created as a practical exercise to strengthen software architecture, domain modeling, and modern web development skills.

## Overview

The project combines a .NET API with a Next.js web interface to manage users, categories, financial transactions, and monthly budgets. Development is incremental, with a strong focus on code quality and layered architecture.

## Status

Actively in development.

## Stack

- Backend: C#, .NET, ASP.NET Core
- Frontend: Next.js, React, TypeScript, Tailwind CSS

## Implemented Features

- Create, read, update, and delete users
- Create, read, update, and delete transaction categories
- Create, read, update, and delete financial transactions
- Domain structure for budget management

## Repository Structure

- backend: API, application, domain, and infrastructure
- frontend: web application
- exercice.en.md and exercice.pt.md: exercise context and requirements

## Running Locally

### Backend

```bash
cd backend/src/SmartBudgetPro.API
dotnet restore
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Next Steps

- Integrate frontend with API endpoints
- Implement authentication and authorization
- Add automated tests
- Evolve budgeting rules and reporting

## Project Goal

This repository was created for applied learning while following a real product direction. The goal is to continuously evolve SmartBudget while practicing technical decisions that matter in professional software projects.

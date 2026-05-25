# Implementation Plan: Fake Backend Refactoring

This plan details how we will migrate the current state management approach (which relies heavily on Nuxt composables and raw `localStorage`) to the more robust, scalable architecture defined in our Fake Backend plan. 

## Goal
Implement a clear separation of concerns by using **Pinia** for reactive application memory, **pure TypeScript Services** for business logic (our fake APIs), and static **mock data files** for our fake database.

## Proposed Changes

---

### Phase 1: Setup & Core Infrastructure

#### [MODIFY] [package.json](file:///Users/lnaguit/Desktop/code/loan-management-platform/package.json) & [nuxt.config.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/nuxt.config.ts)
- Install `pinia` and `@pinia/nuxt`.
- Add `@pinia/nuxt` to the Nuxt modules configuration.

#### [NEW] [core/storage.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/core/storage.ts)
- Abstract `localStorage` access so we aren't writing `localStorage.getItem` directly in our stores. Handles parsing, stringifying, and SSR safety.

#### [NEW] [plugins/init.client.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/plugins/init.client.ts)
- A Nuxt plugin that runs strictly on the client-side to hydrate all Pinia stores from `localStorage` the moment the app boots. This replaces the `onMounted(load)` scattered across all composables.

---

### Phase 2: The Fake Database (Mock Data)

Currently, mock data lives in `server/data/*.json`. We will move this into our frontend memory space as TypeScript modules so it's instantly available without fake network latency unless we specifically simulate it.

#### [NEW] [mock-data/users.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/mock-data/users.ts)
#### [NEW] [mock-data/loans.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/mock-data/loans.ts)
#### [NEW] [mock-data/payroll.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/mock-data/payroll.ts)
#### [NEW] [mock-data/approvals.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/mock-data/approvals.ts)
- These files will export the raw arrays of mock data.
#### [DELETE] server/data/*.json

---

### Phase 3: Application Memory (Pinia Stores)

We will replace the stateful parts of our Vue composables with Pinia stores. These stores will *only* hold state, getters, and basic mutations (no complex business logic).

#### [NEW] [stores/auth.store.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/stores/auth.store.ts)
#### [NEW] [stores/loan.store.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/stores/loan.store.ts)
#### [NEW] [stores/repayment.store.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/stores/repayment.store.ts)
#### [NEW] [stores/payroll.store.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/stores/payroll.store.ts)
#### [NEW] [stores/approval.store.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/stores/approval.store.ts)

---

### Phase 4: API Abstraction (Service Layer)

We will extract the business logic currently inside composables (like `generateLoanRef`, `batchProcessCycle`, `recordTransaction`) into pure TypeScript files. 

#### [NEW] [services/loan.service.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/services/loan.service.ts)
#### [NEW] [services/payroll.service.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/services/payroll.service.ts)
#### [NEW] [services/approval.service.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/services/approval.service.ts)
- Example: The UI will call `LoanService.applyForLoan(data)`, which will internally run validations, update the `loan.store.ts`, add a step to the `approval.store.ts`, and optionally log to the console.

#### [NEW] [core/seeder.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/core/seeder.ts)
- Centralized service that pulls from `/mock-data` and pushes into the Pinia stores.

---

### Phase 5: Component Refactoring & Cleanup

#### [MODIFY] All Vue Pages & Components
- Swap out all `useDemoAuth()`, `useLoanApplications()`, etc.
- Import `Stores` for reactive reads (e.g., `storeToRefs(useLoanStore())`).
- Import `Services` for triggering actions.

#### [DELETE] Old Composables
- Safely delete `useDemoAuth`, `useLoanApplications`, `useSchedules`, `useRepayments`, `useApprovals`, `usePayroll`, `useMyLoans`, `useDemoSeeder`. (Leaving behind structural composables like `useAppToast` and `useAppLogger`).

---

## Open Questions

> [!WARNING]
> This is a massive refactoring effort that touches almost every file in the system. 
> 
> **Question:** Would you like me to tackle this in a single, sweeping migration, or should we break it down and refactor module by module (e.g., Auth & Core first, then Loans, then Payroll)?

## Verification Plan

1. The application boots without errors.
2. The Demo FAB can successfully seed the database.
3. The Role Switcher still works perfectly and hides/shows appropriate sidebar menus.
4. Payroll batch processing correctly updates the schedule and ledger via the new Service layer.

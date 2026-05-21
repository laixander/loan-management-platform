# Repayment Tracker — Implementation Plan

This plan outlines the steps to build the **Repayment Tracker** page (`/repayments`), the third module in the Core CRUD group. This feature functions as a universal ledger to record and monitor financial transactions (primarily repayments) against active loan applications.

## Proposed Changes

---

### Types & Data Layer

We will define the schema and mock data for `LoanTransaction` as specified in the blueprint.

#### [NEW] [repayment.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/types/repayment.ts)
- Create types: `LoanTransaction` and `TransactionType`.
- Update `app/types/index.ts` to export this module.

#### [NEW] [repayments.json](file:///Users/lnaguit/Desktop/code/loan-management-platform/server/data/repayments.json)
- Create a mock dataset representing a few recent repayments and disbursements for the currently active/approved loans.

#### [NEW] [repayments.get.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/server/api/repayments.get.ts)
- Nitro endpoint to serve the initial mock data for the seeder.

---

### State Management

#### [NEW] [useRepayments.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/useRepayments.ts)
- Implement `useState` and `localStorage` persistence for `LoanTransaction`.
- **Core Method**: `recordTransaction(applicationId, amount, type, description)`. This method will:
  - Find the specified `LoanApplication`.
  - Calculate `balanceBefore` (by aggregating past transactions or relying on a running balance).
  - Calculate `balanceAfter`.
  - Save the transaction and log the action via `useLogger()`.

#### [MODIFY] [useDemoSeeder.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/useDemoSeeder.ts)
- Update `seedAll()` to fetch `/api/repayments` and populate the local store.
- Update `resetAll()` to clear the ledger.

---

### User Interface

#### [NEW] [RepaymentModal.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/components/RepaymentModal.vue)
- Create a `UModal` with a `UForm` (Zod validation) to manually record a transaction.
- Form fields:
  - **Loan Application**: Dropdown (filtered to show only `Active` or `Disbursed` loans, populated via `useLoanApplications()`).
  - **Transaction Type**: Dropdown (`Repayment`, `Adjustment`, `Penalty`, etc.).
  - **Amount**: Number input.
  - **Description**: Textarea.
- Note: Admins do not manually input `balanceBefore` or `balanceAfter`; the system determines these mathematically.

#### [NEW] [repayments.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/pages/repayments.vue)
- Render a `UTable` listing all transactions (the ledger).
- **Columns**: Date, Reference (LoanRef), Type, Description, Amount (₱), Balance After (₱).
- **Actions**: While financial ledgers are usually immutable (append-only), we will include a "Delete/Void" action purely for demo CRUD purposes.

#### [MODIFY] [default.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/layouts/default.vue)
- Add "Repayment Tracker" to the "Loan Operations" sidebar group, below "Loan Applications".

## Open Questions

> [!WARNING]
> 1. **Balance Calculation**: For this initial version, should we calculate a loan's outstanding balance purely by taking the `LoanApplication.approvedAmount` and subtracting all historical `Repayment` transactions? Or do you prefer we track a static `outstandingBalance` property directly on the `LoanApplication` entity?
> 2. **Immutability**: Ledgers are strictly append-only in real life. Do you want me to disable the "Edit" and "Delete" actions on this table to reflect real-world financial systems, or keep them for demo flexibility?

## Verification Plan

### Automated/Manual Verification
- Trigger **Deploy Demo Data** and verify that transactions populate in the Repayment Tracker.
- Open the "Record Transaction" modal, select an active loan, and record a repayment.
- Verify that the new transaction appears in the table with the correctly calculated `balanceBefore` and `balanceAfter`.
- Verify the action is tracked in the History drawer.

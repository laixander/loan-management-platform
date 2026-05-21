# Repayment Schedules & Payroll Deductions — Implementation Plan

This revised plan details the implementation of the **Payroll Deductions** module alongside the **Repayment Schedules** module to strictly follow the architecture blueprint, as requested.

## Proposed Changes

---

### Phase 1: Repayment Schedules (Restoring the Blueprint)

#### [MODIFY] [repayment.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/types/repayment.ts)
- Add `RepaymentSchedule` interface and `RepaymentStatus` enum (`'Pending' | 'Paid' | 'Overdue'`) as defined in the blueprint.

#### [NEW] [schedules.json](file:///Users/lnaguit/Desktop/code/loan-management-platform/server/data/schedules.json) & [schedules.get.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/server/api/schedules.get.ts)
- Generate a mock amortization schedule for our active/disbursed loans (e.g. LN-2026-001, LN-2026-002).
- Create a Nitro API endpoint to serve this mock data.

#### [NEW] [useSchedules.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/useSchedules.ts)
- Implement `useState` and `localStorage` persistence for `RepaymentSchedule`.
- Method: `markSchedulePaid(id, date)` to update the schedule status when payroll is processed.

---

### Phase 2: Payroll Deductions

#### [NEW] [payroll.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/types/payroll.ts)
- Create types: `PayrollDeduction` and `DeductionStatus` matching the architecture blueprint.
- Ensure `repaymentScheduleId` is the correct foreign key used here.
- Update `index.ts` to export this module.

#### [NEW] [payroll-deductions.json](file:///Users/lnaguit/Desktop/code/loan-management-platform/server/data/payroll-deductions.json) & [payroll.get.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/server/api/payroll.get.ts)
- Create mock data for an upcoming payroll cycle (e.g., `2026-05-B`) containing deductions linked precisely to the `RepaymentSchedule` entries created in Phase 1.
- Create Nitro endpoint.

#### [NEW] [usePayroll.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/usePayroll.ts)
- **Core Method 1**: `processDeduction(id)` — Marks a single deduction as `Processed`.
- **Core Method 2**: `batchProcessCycle(cycle)` — Marks all `Scheduled` deductions in a specific cycle as `Processed`.
- **System Integration**: When a deduction is `Processed`, the composable will:
  1. Reach into `useSchedules` and mark the associated `RepaymentSchedule` as `Paid`.
  2. Reach into `useRepayments` and automatically generate a real-time `LoanTransaction` (Repayment Ledger Entry), keeping the ledger perfectly in sync.

---

### Phase 3: Seeder & UI Updates

#### [MODIFY] [useDemoSeeder.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/useDemoSeeder.ts)
- Update `seedAll()` and `resetAll()` to include `/api/schedules` and `/api/payroll`.

#### [NEW] [payroll.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/pages/payroll.vue)
- Render a `UTable` specifically for Payroll Deductions.
- **Top Controls**: A `USelect` to filter the table by `payrollCycle`.
- **Columns**: Employee, Schedule # (Installment), Cutoff Date, Deduction Amount, Status.
- **Actions**:
  - Row level: "Process", "Put On-Hold".
  - Header level: **"Run Payroll"** (batch processes all scheduled deductions currently visible).
- Note: Restricted via `useDemoAuth` to only allow roles: `Payroll` and `Admin`.

#### [MODIFY] [default.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/layouts/default.vue)
- Add "Payroll Deductions" to the sidebar navigation under the "Loan Operations" group.

## User Review Required

> [!NOTE]
> - I have **restored the `RepaymentSchedule`** logic to strictly follow the blueprint. Payroll Deductions will now accurately map to specific installments.
> - I will implement your recommendation for **Batch Processing**: running payroll will cascade updates across the system (marking the schedule as Paid, and recording the ledger transaction automatically).

## Verification Plan
1. Deploy Demo Data.
2. Navigate to **Payroll Deductions**.
3. Select cycle `2026-05-B` and click **Run Payroll**.
4. Verify that deductions switch to `Processed`.
5. Switch to **Repayment Tracker** and verify that new ledger entries were generated for the exact deducted amounts.

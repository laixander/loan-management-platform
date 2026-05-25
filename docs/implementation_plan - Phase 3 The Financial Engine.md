# Phase 3: The Financial Engine — Implementation Plan

This phase breathes life into the loan lifecycle. Once an application is approved and disbursed, the system must automatically calculate how the company gets its money back.

## Goal
Implement a Financial Engine that automatically generates Repayment Schedules (Amortization Tables) and corresponding Payroll Deductions, and make this data visible to both Employees (via My Loans) and HR/Payroll (via a new Payroll Deductions dashboard).

## Open Questions
> [!IMPORTANT]
> **Interest Calculation Method**
> For this demo, I will use a **Flat Rate (Straight-Line)** calculation method because it is standard for employee salary loans (e.g., 6% flat per annum). 
> *Formula: `Total Interest = Principal × Interest Rate × (Term / 12)`*
> Does this calculation method work for your demo, or do you need Diminishing Balance?

---

## Proposed Changes

### 1. Data Stores (Pinia)
We will create the dedicated stores to hold the financial data.
#### [NEW] `app/stores/repaymentStore.ts`
- State: `schedules: RepaymentSchedule[]` and `transactions: LoanTransaction[]`
- Actions: `fetchSchedules(loanId)`, `fetchTransactions(loanId)`
#### [NEW] `app/stores/payrollStore.ts`
- State: `deductions: PayrollDeduction[]`
- Actions: `fetchUpcomingDeductions()`, `markAsProcessed(deductionId)`

### 2. Service Layer (The Engine)
#### [NEW] `app/services/finance.service.ts`
- **Method `generateAmortizationSchedule(loanId)`**: 
  - Takes the approved loan, computes the monthly principal and interest using the Flat Rate formula.
  - Generates `N` `RepaymentSchedule` records (where N = termMonths), setting due dates 1 month apart.
  - Automatically generates `N` corresponding `PayrollDeduction` records linked to the employee's payroll cycles.
  - Pushes these to the Pinia stores.

#### [MODIFY] `app/services/loan.service.ts`
- Hook into the final approval workflow: When a loan is fully approved and marked as `Disbursed`, automatically trigger `generateAmortizationSchedule`.

### 3. Employee Self-Service UI
#### [MODIFY] `app/pages/my-loans/[id].vue`
- Wire up the **Amortization Schedule** tab to display a beautiful `UTable` of the generated `RepaymentSchedule` records.
- Wire up the **Transaction Ledger** tab. (Initially, this will just show the "Disbursement" transaction).

### 4. Admin / HR UI
#### [NEW] `app/pages/payroll-deductions.vue`
- Create a dashboard for the Payroll team to see all upcoming deductions grouped by Payroll Cycle (e.g., "May 2026").
- Add a "Process Deductions" button to simulate marking them as `Processed` and converting them into `Paid` repayment transactions.
#### [MODIFY] `app/layouts/default.vue`
- Add the "Payroll Deductions" link to the sidebar navigation under "Financials".

---

## Verification Plan
1. **Employee Flow:** I will log in as an employee, apply for a new loan, and push it through the Approval Queue until Disbursed.
2. **Schedule Check:** I will verify that the Amortization Schedule appears perfectly calculated in the employee's `My Loans` dashboard.
3. **Payroll Check:** I will log in as HR/Payroll, navigate to the Payroll Deductions page, and verify the deductions appear there automatically.

# Approver Context — Implementation Plan

This plan addresses your excellent point: an approver cannot make an informed decision blindly. They need context regarding the applicant's financial health, tenure, and existing obligations.

## Answers to Your Questions

**1. What details should we show?**
To make a sound financial decision, an approver typically needs to see:
- **Employment Details**: Tenure (Hire Date) to ensure they've passed probation.
- **Financial Capacity**: Base Salary and the computed **Debt Service Ratio (DSR)**. DSR tells the approver what percentage of the employee's salary is currently going to debt. 
- **Loan History**: Total Active Loans and Total Outstanding Balance.

**2. Do we integrate it into our system?**
Yes! Since our platform is acting as the central HR/Loan hub, we will integrate this directly. We will enrich our existing `User` records with `baseSalary` and `hireDate`, and the system will automatically cross-reference the `loanStore` to compute their DSR on the fly.

**3. Should we place it under Approval Queue?**
Yes. Specifically, we should embed this context directly into the **Review Application Modal** (`ApprovalModal.vue`) that opens when an approver clicks "Review". We will redesign the modal to be wider (a split view) so the approver can view the employee's financial profile on the left side, and make their Approve/Reject decision on the right side.

---

## Proposed Changes

### `app/types/index.ts`
- **[MODIFY] `User` interface**: Add `baseSalary: number` and `hireDate: string`.

### `app/mock-data/users.ts`
- **[MODIFY] `mockUsers`**: Inject realistic mock data for `baseSalary` (e.g., ₱20,000 - ₱100,000) and `hireDate` into all existing user records.

### `app/components/ApprovalModal.vue`
- **[MODIFY] Layout & Logic**: 
  - Increase the modal width (`sm:max-w-4xl`).
  - Implement a two-column grid:
    - **Left Column (Applicant Profile):** 
      - Fetch the `User` record via `employeeName` or `employeeId`.
      - Calculate Total Active Monthly Amortizations from the `loanStore`.
      - Calculate Projected DSR: `(Existing Amortizations + Requested Amortization) / Base Salary`.
      - Display a visual progress bar for DSR (green if < 30%, yellow if 30-40%, red if > 40%).
      - Show a mini-list of their active loans.
    - **Right Column (Decision Panel):** The existing form (Approve/Reject radio buttons and comments).

## User Review Required

> [!IMPORTANT]
> **DSR Threshold:** In many institutions, a DSR above **40%** is considered high risk and might require automatic rejection or supervisor override. For this UI, I will color-code the DSR as Red if it exceeds 40%. Does 40% align with your standard business logic for the demo, or would you prefer a different threshold?

# Core Workflow (Phase 2) Implementation

This plan outlines the steps to implement the core loan lifecycle, transitioning it from a static mock data display into a fully functional interactive workflow. This covers the journey from an employee applying for a loan, to the system generating an approval sequence, and the managers processing those approvals.

## User Review Required

> [!IMPORTANT]
> **Workflow Generation Logic:** By default, I will configure the system to generate a 3-step approval process (Supervisor → HR → Finance) for **every** new loan application submitted in the `Pending` state. Does this default flow match your expectations, or should we make it dynamic based on loan type/amount right now?

## Proposed Changes

### `app/services/loan.service.ts`

- **[MODIFY] `applyForLoan`:**
  - Inject logic to automatically generate `ApprovalStep` records in the `approvalStore` whenever a new loan is submitted with a status of `Pending` or `Under Review`.
  - The generated steps will be: Step 1 (Supervisor), Step 2 (HR), and Step 3 (Finance).
- **[MODIFY] `updateApplication`:**
  - Add logic to handle "force approvals" (e.g., if an Admin bypasses the queue and forces the status to `Approved` via the quick actions, we should automatically mark all pending approval steps as `Skipped` or `Approved` to keep the data clean).

---

### `app/components/LoanApplicationModal.vue`

- **[MODIFY] Form Layout:**
  - Implement Role-Based Access Control (RBAC) within the form itself. If `authStore.currentRole === 'Employee'`, we will hide administrative fields such as `Status`, `Approved Amount`, and `Remarks`.
  - For employees, automatically enforce the submission status as `Pending`.

---

### `app/pages/approvals.vue`

- **[MODIFY] Queue Filtering:**
  - Ensure the table correctly reacts to state changes after an approval is processed so the row immediately disappears from the user's "Pending Approvals" view. (It mostly does this already via the computed property, but we will verify reactivity).

---

### `app/services/approval.service.ts`

- **[MODIFY] `processStep`:**
  - Verify that when a step is processed, the system correctly updates the parent loan application status (e.g., moving to `Approved` when the final step passes, or `Rejected` if any step fails). The foundational code is there, but we will ensure it fires the correct UI toast notifications and logger events.

## Verification Plan

### Automated Tests
- This is a frontend-only fake backend, so we will rely on manual testing via the Nuxt Dev Server.

### Manual Verification
1. **Apply for Loan (Employee Role):**
   - Switch role to `Employee`.
   - Open `Loan Applications` and click "New Application".
   - Verify admin fields are hidden.
   - Submit the form and verify the toast appears and the status is `Pending`.
2. **Process Queue (Approver Roles):**
   - Switch role to `Supervisor`.
   - Open `Approval Queue` and verify the new loan is waiting at Step 1.
   - Click "Review" and "Approve".
   - Switch role to `HR` -> Approve Step 2.
   - Switch role to `Finance` -> Approve Step 3.
3. **Verify Completion:**
   - Verify the loan application's status automatically flipped to `Approved` in the dashboard and loan applications table.

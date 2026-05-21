# Employee Self-Service: My Loans — Implementation Plan

This plan details the implementation of the **My Loans** module (Group 5), an employee-facing dashboard that allows employees to view their own loan applications, amortization schedules, and repayment history.

## Proposed Changes

---

### Identity & Authentication Simulation

To build a true employee-facing view, we need a way to simulate an ordinary employee logging into the system.

#### [MODIFY] [useDemoAuth.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/useDemoAuth.ts)
- Expand the mocked auth system to include an `Employee` role.
- Expose a `currentEmployeeId` computed property. When the role is set to `Employee`, this will return `1` (simulating login as **Maria Santos** from our mock data, who currently has one Pending loan and one Active loan).
- For all other Admin/HR roles, `currentEmployeeId` will be `null`.

#### [MODIFY] [DemoFab.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/components/DemoFab.vue)
- Add the `Employee` role to the Role Switcher dropdown so we can toggle into the self-service perspective.

---

### State Management

#### [NEW] [useMyLoans.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/useMyLoans.ts)
Instead of fetching new data, this composable will act as a **secure view layer** over our existing local stores.
- It will read `currentEmployeeId` from `useDemoAuth`.
- **Method `getMyApplications()`**: Returns only loan applications belonging to the current employee.
- **Method `getMySchedules(loanId)`**: Returns the amortization schedule for a specific loan.
- **Method `getMyLedger(loanId)`**: Returns the repayment transaction history for a specific loan.

---

### User Interface

#### [NEW] [my-loans/index.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/pages/my-loans/index.vue)
- An employee dashboard listing all their historical and active loans.
- Displayed as a grid of `UCard`s showing the Loan Type, Amount, Status, and Next Payment Date.
- Clicking a card navigates to the detailed view.
- *Security Guard*: If the user is NOT in the `Employee` role, show an empty state or warning message explaining that this page requires the Employee perspective.

#### [NEW] [my-loans/[id].vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/pages/my-loans/[id].vue)
- A detailed view for a specific loan.
- **Header**: Status banner, Approved Amount, and Outstanding Balance.
- **Tabs**: 
  1. **Amortization Schedule**: A table showing upcoming and past installments.
  2. **Transaction Ledger**: A table showing the raw historical ledger (Disbursements, Deductions) pulled from the Repayment Tracker.

#### [MODIFY] [default.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/layouts/default.vue)
- Add a new sidebar navigation group called **Employee Self-Service**.
- Add the **My Loans** link under this group.

## User Review Required

> [!NOTE]
> To keep the demo simple and robust, I am hardcoding the `Employee` role to simulate **Employee ID 1 (Maria Santos)**. This gives us immediate, rich data to display (one active loan with deductions, one pending loan) without needing a complex login screen.

## Verification Plan
1. Open the FAB Role Switcher and change to **Employee**.
2. Navigate to **Employee Self-Service > My Loans**.
3. Verify that only Maria Santos's loans (LN-2026-001 and LN-2026-006) are visible.
4. Open the active loan and verify the schedule and ledger match the backend data.
5. Switch the role back to `Admin` and verify the page correctly locks you out of the employee view.

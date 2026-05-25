# Fake Backend Architecture Migration

## Overview
We've successfully migrated the application from a mocked composable-based architecture to a robust Fake Backend Architecture utilizing Pinia for state management and dedicated Service classes for business logic.

## Changes Made
### 1. Pinia Stores (`app/stores`)
- Created `auth.store.ts` for role-based access control and employee session management. Added a `showAllPages` toggle.
- Created `loan.store.ts` to manage loan types, applications, and their state.
- Created `repayment.store.ts` for tracking payments and ledger entries.
- Created `payroll.store.ts` for deductions synced to payroll cycles.
- Created `user.store.ts` and `dashboard.store.ts` for the respective modules.

### 2. Service Layer (`app/services`)
- Extracted business logic into `LoanService`, `RepaymentService`, `PayrollService`, `ApprovalService`, `AuthService`, and `UserService`.
- These services handle data manipulation, simulated delays (for realistic UX), and push changes to the stores.

### 3. Role Switcher & Access Control
- Re-purposed the bottom `UserMenu.vue` to function as a powerful Role Toggle.
- Added a **"Show All Pages"** option to optionally reveal restricted pages in the navigation sidebar.
- Added robust restriction gates (`v-if="!isAuthorized"`) on restricted pages (`dashboard.vue`, `approvals.vue`, `loan-applications.vue`, `loan-types.vue`, `payroll.vue`, `repayments.vue`) that display a uniform `[Role] Access Required` message instead of throwing errors.
- Removed the old, static `Viewing as:` placeholder.

### 4. Cleanup
- Safely deleted all obsolete `use[Module].ts` composables.
- Integrated `init.client.ts` plugin to guarantee client-only hydration for all Pinia stores from `localStorage`.

## Testing the Changes
1. Use the **User Menu** (bottom of the left sidebar) to toggle between roles (e.g., Employee vs. Admin).
2. Toggle **Show All Pages** on. Attempt to access `Payroll` while acting as an `Employee` and observe the new `Access Required` UI.
3. Access `Agent Kit` components as they remain unrestricted.

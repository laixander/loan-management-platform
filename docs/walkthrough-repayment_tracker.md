# Walkthrough: Loan Operations Core CRUD

I have successfully implemented the core CRUD operations for **Loan Types**, **Loan Applications**, and the **Repayment Tracker**. These modules serve as the foundation of the Loan Operations feature group and follow the established Agent Kit patterns for mock data and local persistence.

## What was Accomplished

### 1. Data Layer & Types
- **Created Types**: Defined `LoanType`, `LoanApplication`, `LoanTransaction` (ledger), and related sub-types in `app/types/` and exported them globally.
- **Mock Data**: Created JSON mock data in `server/data/` representing realistic configurations (e.g. 5 default loan types, 7 active/pending applications, 4 sample ledger transactions).
- **API Endpoints**: Created `GET` routes in `server/api/` to serve the mock data.

### 2. State Management
- **Composables**: Implemented `useLoanTypes.ts`, `useLoanApplications.ts`, and `useRepayments.ts` to manage state. They support standard CRUD operations (and append-only logic for the ledger). They also integrate with `useLogger` to record audit logs.
- **Auto-Calculations**: The `useRepayments` composable dynamically computes a loan's `balanceBefore` and `balanceAfter` by analyzing historical transactions on the fly, preventing data desynchronization.
- **Demo Seeder**: Updated `useDemoSeeder.ts` so that clicking the floating "Deploy Demo Data" FAB will automatically fetch and seed all entities.

### 3. User Interface
- **Navigation**: Added a new **Loan Operations** section in the sidebar navigation with links to Loan Types, Loan Applications, and Repayment Tracker.
- **CRUD Pages**: Built the main pages using `UTable`. Features include:
  - Sortable columns, currency formatting, and status badges.
  - Dropdown menus for quick actions (e.g. "Approve" an application).
  - An **append-only ledger table** (`/repayments`) without edit/delete actions, reflecting real-world financial system constraints.
  - Integration with the Logs Drawer (accessed via the "History" header button).
- **Forms**: Built `LoanTypeModal.vue`, `LoanApplicationModal.vue`, and `RepaymentModal.vue` using `UModal` and `UForm` with Zod validation. The repayment form filters for active/disbursed loans and displays their real-time dynamically computed outstanding balance before submission.

> [!TIP]
> **How to Test**
> 1. Click the floating **Demo** button (bottom right) and hit **Deploy Demo Data**. This will populate all tables.
> 2. Navigate to **Loan Operations > Repayment Tracker** in the sidebar.
> 3. Click **Record Transaction**, select "LN-2026-006 - Maria Santos" from the dropdown. Notice how it instantly computes her outstanding balance (₱3,333.34).
> 4. Record a "Repayment" of `3333.34` and see the ledger automatically append the transaction and calculate the new balance (₱0).

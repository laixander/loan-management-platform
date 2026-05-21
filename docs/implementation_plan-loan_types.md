# Loan Types Page — Implementation Plan

This plan outlines the steps to build the **Loan Types** page (`/loan-types`), which serves as the foundation for the Loan Operations module. All other entities (like Loan Applications) depend on these configured loan types.

## Proposed Changes

---

### Types & Data Layer

We will establish the schema and mock data for `LoanType` based on the `ARCHITECTURE.md` blueprint.

#### [NEW] [loan-type.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/types/loan-type.ts)
- Create new types: `LoanType`, `EligibilityRule`, and `InterestMethod`.
- These will represent the full entity schema, separate from the read-only dashboard DTOs.

#### [NEW] [loan-types.json](file:///Users/lnaguit/Desktop/code/loan-management-platform/server/data/loan-types.json)
- Create a mock dataset featuring standard company loan offerings (Salary Loan, Emergency Loan, Equipment Loan, etc.).
- Ensure these IDs map correctly to the existing dashboard data.

#### [NEW] [loan-types.get.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/server/api/loan-types.get.ts)
- Simple Nitro endpoint to read and parse the `loan-types.json` mock data.

---

### State Management

Following the established "Handover Ready Pattern" in `useUsers`, we will build a composable that fetches initial data from the API and manages CRUD operations using `localStorage`.

#### [NEW] [useLoanTypes.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/useLoanTypes.ts)
- Implement `useState` and `localStorage` persistence.
- Methods: `load()`, `addLoanType()`, `updateLoanType()`, `deleteLoanType()`, and `setLoanTypes()`.
- Integrate `useLogger()` to log all mutations.

#### [MODIFY] [useDemoSeeder.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/composables/useDemoSeeder.ts)
- Update `seedAll()` to also fetch from `/api/loan-types` and populate `useLoanTypes`.
- Update `resetAll()` to clear `useLoanTypes`.

---

### User Interface

The main UI will feature a data table with actions, and an overlay (modal or slide-over) for creating and editing loan types.

#### [NEW] [loan-types.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/pages/loan-types.vue)
- Set `definePageMeta` with `isTable: true` and header action ("Add Loan Type").
- Render a Nuxt UI `UTable` listing loan types.
- **Columns**: Name, Max Amount, Interest Rate, Max Term, Status (Active toggle), Actions.
- Render an embedded slideover or modal containing a `UForm` for Create/Edit operations.
  - Fields: Name, Description, Max Amount, Min Tenure, Interest Rate, Interest Method, Max Repayment Months, Active Status.
  - Validation using Zod.

#### [MODIFY] [default.vue](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/layouts/default.vue)
- Update the sidebar navigation items to include a new **Loan Management** group with the "Loan Types" link.
- Update the header title text from "ParkSpot" to "Loan Management Platform" or a suitable branding (since the current layout says "ParkSpot").

## Open Questions

> [!WARNING]
> 1. **Branding**: The current sidebar header says "ParkSpot". Should I rename this to something else like "LoanSpot" or just use the generic company icon?
> 2. **Form Layout**: For the Create/Edit form, do you prefer a Modal (`UModal`) or a Slide-over Drawer (`USlideover`)? Slide-overs are typically better for forms with many fields.

## Verification Plan

### Automated/Manual Verification
- Run the demo seeder (via the floating DemoFab) to ensure `loan-types` data is seeded correctly.
- Navigate to `/loan-types` and verify the table renders.
- Add a new Loan Type, edit it, and delete it to verify the `useLoanTypes` CRUD operations and localStorage persistence.
- Open the Logs Drawer to verify all mutations were recorded by `useLogger()`.

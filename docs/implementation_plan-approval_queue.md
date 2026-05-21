# Workflow & Approvals — Implementation Plan

This plan details the implementation of the **Approval Queue**, the primary module of the Workflow & Approvals group. This module allows multi-role workflows where applications must pass through various departments (Supervisor → HR → Finance) before full approval.

## Proposed Changes

---

### Types & Data Layer

#### `app/types/approval.ts`
- Create types: `ApprovalStep`, `ApprovalRole`, and `ApprovalStatus` matching the architecture blueprint.
- Update `index.ts` to export this module.

#### `server/data/approvals.json`
- Create mock workflows mapped to our existing `Pending` and `Under Review` loan applications.
- E.g., for an application currently `Under Review`, we'll mock Step 1 (Supervisor) as `Approved`, and Step 2 (HR) as `Pending`.

#### `server/api/approvals.get.ts`
- Simple Nitro endpoint to serve the mock `approvals.json` data.

---

### State Management

#### `app/composables/useApprovals.ts`
- Implement `useState` and `localStorage` persistence for `ApprovalStep`.
- **Core Method**: `processStep(stepId, outcome, comments)`.
  - Sets the current step to `Approved` or `Rejected`.
  - Records the `actionDate`.
  - Records an audit log.
  - *Optionally* triggers a status change on the parent `LoanApplication` if it was the final step or if it was rejected (see open questions).

#### `app/composables/useDemoSeeder.ts`
- Update `seedAll()` to fetch `/api/approvals` and populate the local store.

---

### User Interface

#### `app/components/ApprovalModal.vue`
- Create a `UModal` with a form to record a decision.
- Form fields:
  - **Decision**: Radio buttons (Approve / Reject).
  - **Comments**: Textarea for mandatory remarks on rejection, optional on approval.

#### `app/pages/approvals.vue`
- Render a `UTable` specifically for the Approval Queue.
- This page will list *individual steps* (not just the loan applications), filtered to show steps that are currently `Pending` for action.
- Columns: Loan Ref, Employee, Requested Amount, Role Needed, Action.
- Actions: "Review Application" (opens the Approval Modal).

#### `app/layouts/default.vue`
- Create a new top-level navigation group called **Workflow & Approvals**.
- Add the **Approval Queue** link under this group.

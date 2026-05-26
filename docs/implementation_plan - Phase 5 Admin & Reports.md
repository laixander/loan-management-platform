# Goal Description

The goal is to implement **Phase 5: Admin & Reports**. This phase completes the system by adding the necessary administrative tooling to manage users, monitor system health, and extract business insights.

## Proposed Changes

We will build out four new pages and their supporting services:

### 1. Employee Directory (`app/pages/employees.vue`)
- **UI:** A data table to manage all employee profiles (View, Edit, Delete).
- **Forms:** Create `app/components/UserModal.vue` to allow Admins/HR to Add/Update employee information, change base salaries, and most importantly, reassign **System Roles** (e.g., promoting someone to 'Finance' or 'Payroll').
- **Service:** Create `app/services/user.service.ts` to handle the business logic and state mutations for `userStore`.

### 2. Audit Logs (`app/pages/audit-logs.vue`)
- **UI:** A global read-only ledger that aggregates all action logs across the system.
- **Logic:** It will read from the various `useLogger` namespaces (e.g., `loan-applications`, `approvals`, `payroll`) and merge them into a single, sortable, and filterable master timeline for compliance auditing.

### 3. Reports & Analytics (`app/pages/reports.vue`)
- **UI:** A reporting dashboard tailored for Management and Finance.
- **Visuals:** Will utilize `vue-chartjs` (which is already installed) to display charts like "Disbursements vs Collections" and "Loans by Type".
- **Exports:** A mock export button to simulate downloading CSV/PDF reports.

### 4. Settings (`app/pages/settings.vue`)
- **UI:** A configuration hub for system-wide toggles (e.g., "Enable Auto-Disbursement", "Maintenance Mode", "Notification Preferences"). 
- **Logic:** Will use a new `useSettingsStore` to persist these preferences locally.

---

## User Review Required

> [!IMPORTANT]  
> Before I proceed, I want to confirm if you want me to build **all four** of these pages right now, or if you prefer I tackle them one by one (starting with the Employee Directory)? 

## Verification Plan

1. **Automated Check:** Run Nuxt dev server and verify routing.
2. **Manual Test:** 
   - Navigate to `/employees` and successfully promote a standard Employee to an Admin.
   - Navigate to `/audit-logs` and verify that past actions (like the loan we just disbursed) show up in the master list.
   - Navigate to `/reports` and ensure the charts render correctly without Vue errors.

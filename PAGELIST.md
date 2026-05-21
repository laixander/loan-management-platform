# Loan Management Platform — Proposed Pages

Derived from [DEVDOCS.md](file:///Users/lnaguit/Desktop/code/loan-management-platform/DEVDOCS.md) and aligned with the existing Agent Kit patterns.

---

## Pages to Build

Organized by sidebar navigation groups. Each page maps to a DEVDOCS module.

### Group 1 — Dashboard & Overview

| # | Page | Route | Type | DEVDOCS Module | Description |
|---|------|-------|------|----------------|-------------|
| 1 | **Dashboard** | `/dashboard` | Dashboard | §8 Reporting & Analytics | KPI stat cards (Active Loans, Pending Approvals, Monthly Collections, Total Outstanding Balance), charts (loan distribution by type, monthly disbursements, collection rate trends, loan aging) |

---

### Group 2 — Loan Operations (Core CRUD)

| # | Page | Route | Type | DEVDOCS Module | Description |
|---|------|-------|------|----------------|-------------|
| 2 | **Loan Types** | `/loan-types` | Table + CRUD | §1 Loan Type Management | Admin table of loan categories (Salary, Emergency, Calamity, Equipment, Cash Advance). Create/Edit modal with fields: name, max amount, min tenure, interest rate, repayment period, eligibility rules, required docs, status toggle |
| 3 | **Loan Applications** | `/loan-applications` | Table + CRUD | §2 Employee Loan Application | Primary table listing all applications. Columns: ID, Employee, Loan Type, Amount, Status (Draft / Pending / Approved / Rejected / Disbursed), Date. Row actions: View, Approve/Reject, Edit. Create form with loan calculator preview |
| 4 | **Repayment Tracker** | `/repayments` | Table | §6 Repayment Tracking | Table of active repayments. Columns: Employee, Loan Ref, Outstanding Balance, Next Deduction, Total Paid, Progress %. Detail drawer showing full amortization schedule & payment history |

---

### Group 3 — Workflow & Approvals

| # | Page | Route | Type | DEVDOCS Module | Description |
|---|------|-------|------|----------------|-------------|
| 5 | **Approval Queue** | `/approvals` | Table | §3 Approval Workflow | Filtered table of pending approvals for the logged-in approver. Actions: Approve, Reject, Add Comment. Shows workflow timeline (Employee → Supervisor → HR → Finance → Payroll) |

---

### Group 4 — Payroll Integration

| # | Page | Route | Type | DEVDOCS Module | Description |
|---|------|-------|------|----------------|-------------|
| 6 | **Payroll Deductions** | `/payroll` | Table | §5 Payroll Integration | Deduction schedule table per payroll cycle. Columns: Employee, Loan Ref, Deduction Amount, Cycle/Cutoff, Status (Scheduled / Processed / On-Hold). Actions: Hold/Resume, Adjust |

---

### Group 5 — Employee Self-Service

| # | Page | Route | Type | DEVDOCS Module | Description |
|---|------|-------|------|----------------|-------------|
| 7 | **My Loans** | `/my-loans` | Table + Cards | §ESS | Employee view of their own loans — active loans as stat cards at top, table of all loan history below. Detail drawer with repayment schedule, remaining balance, and download statement action |
| 8 | **Apply for Loan** | `/my-loans/apply` | Form | §2 Application | Multi-step form: Select loan type → Review eligibility → Fill details → Upload docs → Submit. Includes inline loan calculator |

---

### Group 6 — Administration

| # | Page | Route | Type | DEVDOCS Module | Description |
|---|------|-------|------|----------------|-------------|
| 9 | **Employee Directory** | `/employees` | Table + CRUD | Employee Management | Existing `useUsers()` pattern extended with loan-relevant fields: department, position, tenure, eligibility status |
| 10 | **Audit Logs** | `/audit-logs` | Table | §9 Audit & Compliance | Read-only table of all system activity. Columns: Timestamp, User, Action, Entity, Details. Filter by date range, action type, user |
| 11 | **Settings** | `/settings` | Form / Tabs | §Configurable Rules | Tabbed settings: General, Approval Workflow Config, Notification Preferences, Payroll Integration Config, Eligibility Rules |

---

### Group 7 — Reports

| # | Page | Route | Type | DEVDOCS Module | Description |
|---|------|-------|------|----------------|-------------|
| 12 | **Reports** | `/reports` | Dashboard | §8 Reporting | Sub-tabs: Active Loans Report, Outstanding Balances, Deduction Summaries, Loan Aging, Employee Loan History. Exportable tables + charts |

---

## Proposed Sidebar Navigation Structure

```
📊 Dashboard                    → /dashboard

💰 Loan Management
   ├── Loan Types               → /loan-types
   ├── Loan Applications        → /loan-applications
   └── Repayment Tracker        → /repayments

✅ Approvals                     → /approvals

💵 Payroll
   └── Deductions               → /payroll

👤 Self-Service
   ├── My Loans                 → /my-loans
   └── Apply for Loan           → /my-loans/apply

⚙️ Administration
   ├── Employee Directory       → /employees
   ├── Audit Logs               → /audit-logs
   └── Settings                 → /settings

📈 Reports                      → /reports

🧩 Agent Kit (existing)         → /agent-kit/*
```

---

## Build Priority Recommendation

> [!TIP]
> Recommended build order based on dependency chain and value delivery:

| Phase | Pages | Rationale |
|-------|-------|-----------|
| **Phase 1 — Foundation** | Loan Types, Employee Directory | Data entities that everything else depends on |
| **Phase 2 — Core Flow** | Loan Applications, Approval Queue | The primary business workflow |
| **Phase 3 — Financial** | Repayment Tracker, Payroll Deductions | Financial lifecycle tracking |
| **Phase 4 — Dashboard** | Dashboard, Reports | Visualizations once data entities exist |
| **Phase 5 — Self-Service** | My Loans, Apply for Loan | Employee-facing portal views |
| **Phase 6 — Admin** | Audit Logs, Settings | Governance and configuration |

---

## Technical Notes

> [!IMPORTANT]
> Each page will follow the Agent Kit patterns:
> - `definePageMeta({ title, isTable, headerActions })`
> - `useOverlay()` for modals & drawers
> - `useEvents()` for header action → page communication
> - `useLogger()` + `LogsDrawer` for audit trails
> - `useState()` + `localStorage` for demo data persistence
> - `useDemoSeeder()` for populating sample data
> - New composables follow existing naming: `useLoanTypes()`, `useLoanApplications()`, etc.
> - New types added to [types/index.ts](file:///Users/lnaguit/Desktop/code/loan-management-platform/app/types/index.ts)

> [!NOTE]
> The Notifications module (§7) is handled cross-cutting via `useAppToast()` and doesn't need its own page — it fires contextually from actions on other pages.

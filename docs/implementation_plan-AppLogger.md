# Centralize Application Logging using a Semantic Function Wrapper

This plan outlines the steps to refactor `logger.addLog()` calls across the entire application by introducing a centralized, domain-specific `useAppLogger` composable. This will decouple message formatting and logging metadata from our business components, enforce standardized log naming, and make future telemetry integrations (e.g., Sentry/Datadog) seamless.

## Proposed Changes

We will introduce a new centralized `useAppLogger` composable and refactor all existing files that currently call `logger.addLog()` or hold unused `useLogger` references.

---

### Centralized Composable

#### [NEW] [useAppLogger.ts](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/composables/useAppLogger.ts)
A brand new composable that initializes domain-specific loggers internally and exposes clear, typed, semantic helper functions for each log scenario in the app.

```typescript
import { useLogger } from './useLogger'

export const useAppLogger = () => {
    const loanLogger = useLogger('loan-applications')
    const repaymentLogger = useLogger('repayments')
    const approvalLogger = useLogger('approvals')
    const loanTypeLogger = useLogger('loan-types')
    const payrollLogger = useLogger('payroll')
    const scheduleLogger = useLogger('schedules')
    const userLogger = useLogger('users')

    return {
        // ============================================================================
        // Users & Roles
        // ============================================================================
        logUserAdded(name: string) {
            userLogger.addLog(`Added user: ${name}`, 'Created', 'success')
        },
        logUserUpdated(name: string) {
            userLogger.addLog(`Updated user: ${name}`, 'Updated', 'warn')
        },
        logUserDeleted(name: string) {
            userLogger.addLog(`Deleted user: ${name}`, 'Deleted', 'error')
        },
        logUserToggleStatus(name: string, isActivating: boolean) {
            userLogger.addLog(
                `${isActivating ? 'Activated' : 'Deactivated'} user: ${name}`,
                isActivating ? 'Activated' : 'Deactivated',
                'info'
            )
        },

        // ============================================================================
        // Repayments & Ledger
        // ============================================================================
        logRepaymentRecorded(type: string, amount: number, loanRef: string) {
            repaymentLogger.addLog(`Recorded ${type} of ₱${amount.toLocaleString()} for ${loanRef}`, 'repayment.recorded', 'success')
        },
        logRepaymentCleared() {
            repaymentLogger.addLog('Cleared ledger', 'repayment.cleared', 'warn')
        },

        // ============================================================================
        // Approvals Workflow
        // ============================================================================
        logApprovalProcessed(stepOrder: number, role: string, outcome: string, loanRef: string) {
            approvalLogger.addLog(
                `Processed step ${stepOrder} (${role}) as ${outcome} for ${loanRef}`,
                'approval.processed',
                outcome === 'Approved' ? 'success' : 'warn'
            )
        },
        logApprovalCleared() {
            approvalLogger.addLog('Cleared approvals', 'approval.cleared', 'warn')
        },

        // ============================================================================
        // Loan Applications
        // ============================================================================
        logApplicationCreated(loanRef: string, employeeName: string) {
            loanLogger.addLog(`Created application ${loanRef} for ${employeeName}`, 'application.created', 'success')
        },
        logApplicationStatusChanged(loanRef: string, newStatus: string) {
            loanLogger.addLog(`Application ${loanRef} status changed to ${newStatus}`, 'application.status_changed', 'info')
        },
        logApplicationUpdated(loanRef: string) {
            loanLogger.addLog(`Updated application: ${loanRef}`, 'application.updated', 'info')
        },
        logApplicationDeleted(loanRef: string) {
            loanLogger.addLog(`Deleted application: ${loanRef}`, 'application.deleted', 'warn')
        },
        logApplicationCleared() {
            loanLogger.addLog('Cleared all loan applications', 'application.cleared', 'warn')
        },

        // ============================================================================
        // Loan Types
        // ============================================================================
        logLoanTypeCreated(name: string) {
            loanTypeLogger.addLog(`Created loan type: ${name}`, 'loan_type.created', 'success')
        },
        logLoanTypeUpdated(name: string) {
            loanTypeLogger.addLog(`Updated loan type: ${name}`, 'loan_type.updated', 'info')
        },
        logLoanTypeDeleted(name: string) {
            loanTypeLogger.addLog(`Deleted loan type: ${name}`, 'loan_type.deleted', 'warn')
        },
        logLoanTypeCleared() {
            loanTypeLogger.addLog('Cleared all loan types', 'loan_type.cleared', 'warn')
        },

        // ============================================================================
        // Payroll Deductions
        // ============================================================================
        logPayrollDeductionUpdated(id: number, status: string) {
            payrollLogger.addLog(`Updated deduction #${id} to ${status}`, 'payroll.update', 'info')
        },
        logPayrollBatchProcessed(cycle: string, recordCount: number) {
            payrollLogger.addLog(`Batch processed cycle ${cycle} (${recordCount} records)`, 'payroll.batch', 'success')
        },

        // ============================================================================
        // Repayment Schedules
        // ============================================================================
        logSchedulePaid(id: number) {
            scheduleLogger.addLog(`Marked schedule #${id} as Paid`, 'schedule.paid', 'success')
        }
    }
}
```

---

### Core Composable Refactoring

We will replace the local `const logger = useLogger(...)` definitions and explicit `logger.addLog(...)` strings with functions from the new `useAppLogger` composable.

#### [MODIFY] [useRepayments.ts](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/composables/useRepayments.ts)
- Replace `const logger = useLogger('repayments')` with `const { logRepaymentRecorded, logRepaymentCleared } = useAppLogger()`.
- Update transaction recording and clearing logs.

#### [MODIFY] [useApprovals.ts](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/composables/useApprovals.ts)
- Replace `const logger = useLogger('approvals')` with `const { logApprovalProcessed, logApprovalCleared } = useAppLogger()`.
- Update approval step and workflow clearing logs.

#### [MODIFY] [useLoanApplications.ts](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/composables/useLoanApplications.ts)
- Replace `const logger = useLogger('loan-applications')` with `const { logApplicationCreated, logApplicationStatusChanged, logApplicationUpdated, logApplicationDeleted, logApplicationCleared } = useAppLogger()`.
- Update application lifecycle logs.

#### [MODIFY] [useLoanTypes.ts](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/composables/useLoanTypes.ts)
- Replace `const logger = useLogger('loan-types')` with `const { logLoanTypeCreated, logLoanTypeUpdated, logLoanTypeDeleted, logLoanTypeCleared } = useAppLogger()`.
- Update loan configuration logs.

#### [MODIFY] [usePayroll.ts](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/composables/usePayroll.ts)
- Replace `const logger = useLogger('payroll')` with `const { logPayrollDeductionUpdated, logPayrollBatchProcessed } = useAppLogger()`.
- Update payroll deduction status updates and run logs.

#### [MODIFY] [useSchedules.ts](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/composables/useSchedules.ts)
- Replace `const logger = useLogger('schedules')` with `const { logSchedulePaid } = useAppLogger()`.
- Update repayment status update logs.

---

### View Refactoring

#### [MODIFY] [table.vue](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/pages/agent/table.vue)
- Replace local `const logger = useLogger('users')` with `const { logUserAdded, logUserUpdated, logUserDeleted, logUserToggleStatus } = useAppLogger()`.
- Update CRUD event logs.

#### [MODIFY] [repayments.vue](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/pages/repayments.vue)
- Remove the unused `const logger = useLogger('repayments')` import/instantiation.

#### [MODIFY] [loan-applications.vue](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/pages/loan-applications.vue)
- Remove the unused `const logger = useLogger('loan-applications')` import/instantiation.

#### [MODIFY] [loan-types.vue](file:///c:/Users/laixa/OneDrive/Desktop/code/loan-management-platform/app/pages/loan-types.vue)
- Remove the unused `const logger = useLogger('loan-types')` import/instantiation.

---

## Verification Plan

### Automated Verification
- We will verify that the Nuxt dev server builds successfully with no TypeScript compilation errors or console warnings.
- Perform tests by executing various actions in the browser dashboard (e.g. creating/processing loan applications, adding repayment transactions, running batch payroll) and checking that the logs correctly appear inside each page's **History** slideout drawer.

### Manual Verification
- We will verify that the dynamic namespaces are correctly rendered in `LogsDrawer` for:
  - Users
  - Repayments
  - Approvals
  - Loan Applications
  - Loan Types
  - Payroll Cycles
  - Schedules

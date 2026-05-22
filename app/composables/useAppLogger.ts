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

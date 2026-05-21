// ============================================================================
// Types: Payroll Deductions
// ============================================================================

export type DeductionStatus = 'Scheduled' | 'Processed' | 'On-Hold' | 'Cancelled'

export interface PayrollDeduction {
    id: number
    employeeId: number
    employeeName: string // Denormalized for display
    loanRef: string // Denormalized for display
    repaymentScheduleId: number
    installmentNumber: number // Denormalized for display
    payrollCycle: string // e.g. "2026-05-A"
    cutoffDate: string // ISO date
    deductionAmount: number
    status: DeductionStatus
    processedDate: string | null
}

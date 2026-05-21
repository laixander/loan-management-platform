// ============================================================================
// Types: Workflow & Approvals
// ============================================================================

export type ApprovalRole = 'Supervisor' | 'HR' | 'Finance' | 'Payroll' | 'Admin'
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Skipped'

export interface ApprovalStep {
    id: number
    loanApplicationId: number
    loanRef: string // Denormalized for display
    employeeName: string // Denormalized for display
    requestedAmount: number // Denormalized for display
    stepOrder: number
    role: ApprovalRole
    approverId: number | null
    status: ApprovalStatus
    comments: string | null
    actionDate: string | null
}

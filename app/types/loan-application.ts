// ============================================================================
// Types: Loan Application
// ============================================================================

export type LoanStatus =
    | 'Draft'
    | 'Pending'
    | 'Under Review'
    | 'Approved'
    | 'Rejected'
    | 'Disbursed'
    | 'Active'
    | 'Completed'
    | 'Defaulted'

export interface LoanDocument {
    id: number
    loanApplicationId: number
    documentName: string
    documentType: string
    filePath: string
    uploadedAt: string
}

export interface LoanApplication {
    id: number
    loanRef: string
    employeeId: number
    employeeName: string
    loanTypeId: number
    loanType: string
    requestedAmount: number
    approvedAmount: number | null
    termMonths: number
    interestRate: number
    monthlyAmortization: number | null
    status: LoanStatus
    applicationDate: string
    approvalDate: string | null
    disbursementDate: string | null
    completionDate: string | null
    remarks: string | null
    documents?: LoanDocument[]
}

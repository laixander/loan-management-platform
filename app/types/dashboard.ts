// ============================================================================
// Types: Loan Dashboard
// ============================================================================

export interface LoanApplication {
    id: number
    employeeName: string
    loanType: string
    amount: number
    status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Disbursed'
    date: string
    term: number
}

export interface LoanType {
    id: number
    name: string
    maxAmount: number
    interestRate: number
    activeLoans: number
    totalDisbursed: number
}

export interface RepaymentRecord {
    id: number
    employeeName: string
    loanRef: string
    loanType: string
    outstandingBalance: number
    totalPaid: number
    nextDeduction: string
    progressPercent: number
}

export interface DashboardStats {
    totalActiveLoans: number
    pendingApprovals: number
    monthlyCollections: number
    totalOutstanding: number
    totalDisbursed: number
    collectionRate: number
}

export interface DashboardData {
    stats: DashboardStats
    recentApplications: LoanApplication[]
    loanTypes: LoanType[]
    repayments: RepaymentRecord[]
    monthlyDisbursements: { month: string; amount: number }[]
    monthlyCollections: { month: string; amount: number }[]
    loansByStatus: { status: string; count: number }[]
    loansByType: { type: string; count: number }[]
}

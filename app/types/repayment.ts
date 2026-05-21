// ============================================================================
// Types: Repayment & Ledger Transactions
// ============================================================================

export type TransactionType = 'Disbursement' | 'Repayment' | 'Adjustment' | 'Penalty' | 'Waiver' | 'Settlement'

export interface LoanTransaction {
    id: number
    loanApplicationId: number
    loanRef: string // Denormalized for display
    transactionType: TransactionType
    amount: number
    balanceBefore: number
    balanceAfter: number
    description: string | null
    transactionDate: string
}

export type RepaymentStatus = 'Pending' | 'Paid' | 'Overdue'

export interface RepaymentSchedule {
    id: number
    loanApplicationId: number
    loanRef: string // Denormalized for display
    employeeName: string // Denormalized for display
    installmentNumber: number
    dueDate: string
    principalAmount: number
    interestAmount: number
    totalAmount: number
    runningBalance: number
    status: RepaymentStatus
    paidDate: string | null
}

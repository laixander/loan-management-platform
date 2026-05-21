// ============================================================================
// Types: Loan Type
// ============================================================================

export type InterestMethod = 'flat' | 'diminishing' | 'fixed'

export interface EligibilityRule {
    id: number
    loanTypeId: number
    ruleType: 'tenure' | 'status' | 'existing_loans' | 'net_pay' | 'department'
    operator: 'gte' | 'lte' | 'eq' | 'neq' | 'in' | 'not_in'
    value: string
    description: string
}

export interface LoanType {
    id: number
    name: string
    description: string
    maxAmount: number
    minTenureMonths: number
    interestRate: number
    interestMethod: InterestMethod
    maxRepaymentMonths: number
    requiredDocuments: string[]
    isActive: boolean
    activeLoans: number
    totalDisbursed: number
    createdAt: string
    updatedAt: string
}

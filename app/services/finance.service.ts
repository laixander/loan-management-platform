import type { LoanApplication, RepaymentSchedule, PayrollDeduction, LoanTransaction } from '~/types'
import { useLoanStore } from '~/stores/loan.store'
import { useRepaymentStore } from '~/stores/repayment.store'
import { usePayrollStore } from '~/stores/payroll.store'

export const FinanceService = {

    /**
     * Generates a flat-rate amortization schedule for a given loan,
     * along with the corresponding payroll deductions.
     */
    generateAmortizationSchedule(loan: LoanApplication) {
        const principal = loan.approvedAmount || loan.requestedAmount

        if (!principal || !loan.termMonths) {
            console.warn('Cannot generate schedule: Missing amount or term months.')
            return
        }

        const loanStore = useLoanStore()
        const payrollStore = usePayrollStore()
        const repaymentStore = useRepaymentStore()

        const term = loan.termMonths
        const annualRate = loan.interestRate / 100

        // Flat Rate Math
        const totalInterest = principal * annualRate * (term / 12)
        const totalAmountPayable = principal + totalInterest
        
        const monthlyTotal = totalAmountPayable / term
        const monthlyPrincipal = principal / term
        const monthlyInterest = totalInterest / term

        // We will start dates from the current date + 1 month
        // In a real system, this would be based on the disbursement date.
        const baseDate = loan.disbursementDate ? new Date(loan.disbursementDate) : new Date()

        const newSchedules: RepaymentSchedule[] = []
        const newDeductions: PayrollDeduction[] = []

        // ID Generators (for mock)
        const nextScheduleId = Math.max(0, ...loanStore.schedules.map(s => s.id)) + 1
        const nextDeductionId = Math.max(0, ...payrollStore.deductions.map(d => d.id)) + 1
        const nextTxId = Math.max(0, ...repaymentStore.transactions.map(t => t.id)) + 1

        let runningBalance = totalAmountPayable

        for (let i = 1; i <= term; i++) {
            const dueDate = new Date(baseDate)
            dueDate.setMonth(dueDate.getMonth() + i)
            
            // Deduct the current month's payment from the running balance
            runningBalance -= monthlyTotal
            
            // Handle floating point precision errors for the last payment
            if (i === term) runningBalance = 0

            const scheduleId = nextScheduleId + (i - 1)

            // 1. Generate Schedule
            newSchedules.push({
                id: scheduleId,
                loanApplicationId: loan.id,
                loanRef: loan.loanRef,
                employeeName: loan.employeeName,
                installmentNumber: i,
                dueDate: dueDate.toISOString(),
                principalAmount: monthlyPrincipal,
                interestAmount: monthlyInterest,
                totalAmount: monthlyTotal,
                runningBalance: runningBalance,
                status: 'Pending',
                paidDate: null
            })

            // 2. Generate Payroll Deduction
            // We simulate a single deduction per month mapped to the 'B' (end of month) cycle for simplicity
            const monthStr = (dueDate.getMonth() + 1).toString().padStart(2, '0')
            const yearStr = dueDate.getFullYear().toString()

            newDeductions.push({
                id: nextDeductionId + (i - 1),
                employeeId: loan.employeeId,
                employeeName: loan.employeeName,
                loanRef: loan.loanRef,
                repaymentScheduleId: scheduleId,
                installmentNumber: i,
                payrollCycle: `${yearStr}-${monthStr}-B`,
                cutoffDate: dueDate.toISOString(),
                deductionAmount: monthlyTotal,
                status: 'Scheduled',
                processedDate: null
            })
        }

        // 3. Generate the Initial Disbursement Transaction Ledger Entry
        const disbursementTx: LoanTransaction = {
            id: nextTxId,
            loanApplicationId: loan.id,
            loanRef: loan.loanRef,
            transactionType: 'Disbursement',
            amount: principal,
            balanceBefore: 0,
            balanceAfter: principal,
            description: 'Initial loan disbursement',
            transactionDate: new Date().toISOString()
        }

        // Push to Stores
        loanStore.addSchedules(newSchedules)
        payrollStore.addDeductions(newDeductions)
        repaymentStore.addTransactions([disbursementTx])
        
        console.log(`Generated ${term} schedules and deductions for loan ${loan.loanRef}`)
    }
}

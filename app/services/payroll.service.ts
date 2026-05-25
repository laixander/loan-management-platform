import { usePayrollStore } from '~/stores/payroll.store'
import { useLoanStore } from '~/stores/loan.store'
import type { DeductionStatus } from '~/types'
import { useAppToast } from '~/composables/useAppToast'
import { useAppLogger } from '~/composables/useAppLogger'
import { LoanService } from './loan.service'
import { RepaymentService } from './repayment.service'

export const PayrollService = {
    async simulateLoading(ms = 300) {
        await new Promise(resolve => setTimeout(resolve, ms))
    },

    async updateStatus(id: number, status: DeductionStatus) {
        await this.simulateLoading()

        const store = usePayrollStore()
        const toast = useAppToast()
        const { logPayrollDeductionUpdated } = useAppLogger()

        const index = store.deductions.findIndex(d => d.id === id)
        if (index === -1) return

        const deduction = store.deductions[index]!
        const updated = [...store.deductions]
        updated[index] = {
            ...deduction,
            status,
            processedDate: status === 'Processed' ? new Date().toISOString() : null
        }
        
        store.setDeductions(updated)
        
        if (import.meta.client) {
            toast.success('Deduction Updated', `${deduction.employeeName} (${deduction.loanRef}) is now ${status}.`)
        }
        logPayrollDeductionUpdated(id, status)
    },

    async batchProcessCycle(cycle: string) {
        await this.simulateLoading(800)

        const store = usePayrollStore()
        const loanStore = useLoanStore()
        const toast = useAppToast()
        const { logPayrollBatchProcessed } = useAppLogger()

        const toProcess = store.deductions.filter(d => d.payrollCycle === cycle && d.status === 'Scheduled')
        
        if (toProcess.length === 0) {
            if (import.meta.client) {
                toast.info('No Deductions', `No scheduled deductions found for cycle ${cycle}.`)
            }
            return
        }

        let updated = [...store.deductions]
        for (const deduction of toProcess) {
            // 1. Mark deduction as Processed
            const index = updated.findIndex(d => d.id === deduction.id)
            updated[index] = {
                ...deduction,
                status: 'Processed',
                processedDate: new Date().toISOString()
            }

            // 2. Integration: Mark RepaymentSchedule as Paid
            await LoanService.markSchedulePaid(deduction.repaymentScheduleId)

            // 3. Integration: Record Repayment in Ledger
            const schedule = loanStore.schedules.find(s => s.id === deduction.repaymentScheduleId)
            
            if (schedule) {
                const app = loanStore.applications.find(a => a.id === schedule.loanApplicationId)
                if (app) {
                    await RepaymentService.recordTransaction(
                        app,
                        'Repayment',
                        deduction.deductionAmount,
                        `Auto-deducted from Payroll Cycle ${cycle}`
                    )
                }
            }
        }

        store.setDeductions(updated)
        
        if (import.meta.client) {
            toast.success('Payroll Run Complete', `Processed ${toProcess.length} deductions for cycle ${cycle}.`)
        }
        logPayrollBatchProcessed(cycle, toProcess.length)
    }
}

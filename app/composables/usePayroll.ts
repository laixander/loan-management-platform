// ============================================================================
// Composable: usePayroll
// ============================================================================
// Manages Payroll Deductions and integrations with Schedules & Ledger.

import type { PayrollDeduction, DeductionStatus } from '~/types'

const STORAGE_KEY = 'demo-payroll'

export const usePayroll = () => {
    const deductions = useState<PayrollDeduction[]>('payroll-deductions', () => [])
    const isLoading = useState('payroll-loading', () => false)
    const isHydrated = ref(false)
    const toast = useAppToast()
    const { logPayrollDeductionUpdated, logPayrollBatchProcessed } = useAppLogger()

    const { markSchedulePaid } = useSchedules()
    const { recordTransaction } = useRepayments()

    const isPending = computed(() => !isHydrated.value || isLoading.value)

    const saveToStorage = (data: PayrollDeduction[]) => {
        deductions.value = data
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }

    const load = () => {
        if (import.meta.server) return
        const stored = localStorage.getItem(STORAGE_KEY)
        deductions.value = stored ? JSON.parse(stored) : []
        isHydrated.value = true
    }

    if (import.meta.client && !isHydrated.value) {
        onMounted(load)
    }

    const updateStatus = async (id: number, status: DeductionStatus) => {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, 300))

        const index = deductions.value.findIndex(d => d.id === id)
        if (index === -1) {
            isLoading.value = false
            return
        }

        const deduction = deductions.value[index]!
        const updated = [...deductions.value]
        updated[index] = {
            ...deduction,
            status,
            processedDate: status === 'Processed' ? new Date().toISOString() : null
        }
        
        saveToStorage(updated)
        toast.success('Deduction Updated', `${deduction.employeeName} (${deduction.loanRef}) is now ${status}.`)
        logPayrollDeductionUpdated(id, status)
        isLoading.value = false
    }

    // Process a specific cycle in batch, updating Schedules and Ledger
    const batchProcessCycle = async (cycle: string) => {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, 800)) // simulate heavy batch process

        const toProcess = deductions.value.filter(d => d.payrollCycle === cycle && d.status === 'Scheduled')
        
        if (toProcess.length === 0) {
            toast.info('No Deductions', `No scheduled deductions found for cycle ${cycle}.`)
            isLoading.value = false
            return
        }

        let updated = [...deductions.value]
        for (const deduction of toProcess) {
            // 1. Mark deduction as Processed
            const index = updated.findIndex(d => d.id === deduction.id)
            updated[index] = {
                ...deduction,
                status: 'Processed',
                processedDate: new Date().toISOString()
            }

            // 2. Integration: Mark RepaymentSchedule as Paid
            await markSchedulePaid(deduction.repaymentScheduleId)

            // 3. Integration: Record Repayment in Ledger
            // To do this, we need the application ID which we can guess from the Schedule or we could have stored it.
            // Wait, we didn't store loanApplicationId in PayrollDeduction, but we can look it up in useSchedules,
            // or just assume we know it. We'll fetch it from the schedule!
            const { schedules } = useSchedules()
            const schedule = schedules.value.find(s => s.id === deduction.repaymentScheduleId)
            
            if (schedule) {
                const { applications } = useLoanApplications()
                const app = applications.value.find(a => a.id === schedule.loanApplicationId)
                if (app) {
                    await recordTransaction(
                        app,
                        'Repayment',
                        deduction.deductionAmount,
                        `Auto-deducted from Payroll Cycle ${cycle}`
                    )
                }
            }
        }

        saveToStorage(updated)
        toast.success('Payroll Run Complete', `Processed ${toProcess.length} deductions for cycle ${cycle}.`)
        logPayrollBatchProcessed(cycle, toProcess.length)
        
        isLoading.value = false
    }

    const setDeductions = (data: PayrollDeduction[]) => {
        saveToStorage(data)
    }

    const clear = (quiet = false) => {
        deductions.value = []
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
        if (!quiet) {
            toast.success('Payroll Cleared', 'All payroll deductions reset.')
        }
    }

    return {
        deductions,
        isLoading,
        isPending,
        load,
        updateStatus,
        batchProcessCycle,
        setDeductions,
        clear
    }
}

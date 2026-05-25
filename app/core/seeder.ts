import { useUserStore } from '~/stores/user.store'
import { useLoanStore } from '~/stores/loan.store'
import { useRepaymentStore } from '~/stores/repayment.store'
import { usePayrollStore } from '~/stores/payroll.store'
import { useApprovalStore } from '~/stores/approval.store'

import { mockUsers } from '~/mock-data/users'
import { mockLoanTypes } from '~/mock-data/loan-types'
import { mockLoanApplications } from '~/mock-data/loan-applications'
import { mockSchedules } from '~/mock-data/schedules'
import { mockRepayments } from '~/mock-data/repayments'
import { mockPayrollDeductions } from '~/mock-data/payroll-deductions'
import { mockApprovals } from '~/mock-data/approvals'
import { mockDashboard } from '~/mock-data/dashboard'
import { useStorage } from '~/core/storage'
import { useDashboardStore } from '~/stores/dashboard.store'

export const useSeeder = () => {
    const storage = useStorage()

    const seedAll = async () => {
        if (import.meta.server) return

        const userStore = useUserStore()
        const loanStore = useLoanStore()
        const repaymentStore = useRepaymentStore()
        const payrollStore = usePayrollStore()
        const approvalStore = useApprovalStore()
        const dashboardStore = useDashboardStore()

        // Apply mock data to stores
        userStore.setUsers(mockUsers)
        
        loanStore.setTypes(mockLoanTypes)
        loanStore.setApplications(mockLoanApplications)
        loanStore.setSchedules(mockSchedules)
        
        repaymentStore.setTransactions(mockRepayments)
        
        payrollStore.setDeductions(mockPayrollDeductions)
        
        approvalStore.setSteps(mockApprovals)

        dashboardStore.setData(mockDashboard as any)

        // Make sure hydration flags are set
        userStore.isHydrated = true
        loanStore.isHydrated = true
        repaymentStore.isHydrated = true
        payrollStore.isHydrated = true
        approvalStore.isHydrated = true
        dashboardStore.isHydrated = true
    }

    const resetAll = async () => {
        if (import.meta.server) return
        
        storage.clearDemoData()
        
        // Reload page to rehydrate stores in empty state
        window.location.reload()
    }

    return {
        seedAll,
        resetAll
    }
}

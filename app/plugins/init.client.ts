import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '~/stores/auth.store'
import { useUserStore } from '~/stores/user.store'
import { useLoanStore } from '~/stores/loan.store'
import { useRepaymentStore } from '~/stores/repayment.store'
import { usePayrollStore } from '~/stores/payroll.store'
import { useApprovalStore } from '~/stores/approval.store'
import { useDashboardStore } from '~/stores/dashboard.store'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        // Hydrate all stores from localStorage on mount
        const authStore = useAuthStore()
        const userStore = useUserStore()
        const loanStore = useLoanStore()
        const repaymentStore = useRepaymentStore()
        const payrollStore = usePayrollStore()
        const approvalStore = useApprovalStore()
        const dashboardStore = useDashboardStore()

        authStore.hydrate()
        userStore.hydrate()
        loanStore.hydrate()
        repaymentStore.hydrate()
        payrollStore.hydrate()
        approvalStore.hydrate()
        dashboardStore.hydrate()
    })
})

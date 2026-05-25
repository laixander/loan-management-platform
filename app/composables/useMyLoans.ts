// ============================================================================
// Composable: useMyLoans
// ============================================================================
// Employee-facing secure view layer over the existing data stores.

export const useMyLoans = () => {
    const authStore = useAuthStore()
    const loanStore = useLoanStore()
    const repaymentStore = useRepaymentStore()

    const isPending = ref(false)

    const myApplications = computed(() => {
        if (!authStore.currentEmployeeId) return []
        return loanStore.applications.filter(a => a.employeeId === authStore.currentEmployeeId)
    })

    const getMySchedules = (loanApplicationId: number) => {
        if (!authStore.currentEmployeeId) return []
        // Verify ownership
        const isOwner = myApplications.value.some(a => a.id === loanApplicationId)
        if (!isOwner) return []

        return loanStore.schedules.filter(s => s.loanApplicationId === loanApplicationId)
    }

    const getMyLedger = (loanApplicationId: number) => {
        if (!authStore.currentEmployeeId) return []
        // Verify ownership
        const isOwner = myApplications.value.some(a => a.id === loanApplicationId)
        if (!isOwner) return []

        return repaymentStore.transactions.filter(t => t.loanApplicationId === loanApplicationId)
    }

    return {
        isPending,
        myApplications,
        getMySchedules,
        getMyLedger
    }
}

// ============================================================================
// Composable: useMyLoans
// ============================================================================
// Employee-facing secure view layer over the existing data stores.

export const useMyLoans = () => {
    const { currentEmployeeId } = useDemoAuth()
    const { applications, isPending: applicationsPending } = useLoanApplications()
    const { schedules, isPending: schedulesPending } = useSchedules()
    const { transactions, isPending: transactionsPending } = useRepayments()

    const isPending = computed(() => {
        return applicationsPending.value || schedulesPending.value || transactionsPending.value
    })

    const myApplications = computed(() => {
        if (!currentEmployeeId.value) return []
        return applications.value.filter(a => a.employeeId === currentEmployeeId.value)
    })

    const getMySchedules = (loanApplicationId: number) => {
        if (!currentEmployeeId.value) return []
        // Verify ownership
        const isOwner = myApplications.value.some(a => a.id === loanApplicationId)
        if (!isOwner) return []

        return schedules.value.filter(s => s.loanApplicationId === loanApplicationId)
    }

    const getMyLedger = (loanApplicationId: number) => {
        if (!currentEmployeeId.value) return []
        // Verify ownership
        const isOwner = myApplications.value.some(a => a.id === loanApplicationId)
        if (!isOwner) return []

        return transactions.value.filter(t => t.loanApplicationId === loanApplicationId)
    }

    return {
        isPending,
        myApplications,
        getMySchedules,
        getMyLedger
    }
}

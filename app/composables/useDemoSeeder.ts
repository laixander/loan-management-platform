// ============================================================================
// Composable: useDemoSeeder
// ============================================================================
// Handles mass-seeding and resetting of the application data for demo purposes.

export const useDemoSeeder = () => {
    const { setUsers, clear: clearUsers } = useUsers()
    const { setDashboard, clear: clearDashboard } = useLoanDashboard()
    const { setLoanTypes, clear: clearLoanTypes } = useLoanTypes()
    const { setApplications, clear: clearApplications } = useLoanApplications()
    const { setTransactions, clear: clearTransactions } = useRepayments()
    const { setSteps, clear: clearSteps } = useApprovals()
    const { setSchedules, clear: clearSchedules } = useSchedules()
    const { setDeductions, clear: clearDeductions } = usePayroll()

    /**
     * Fetch mock data from API and populate local storage
     */
    const seedAll = async () => {
        const [usersData, dashboardData, loanTypesData, applicationsData, repaymentsData, approvalsData, schedulesData, payrollData] = await Promise.all([
            $fetch('/api/users'),
            $fetch('/api/dashboard'),
            $fetch('/api/loan-types'),
            $fetch('/api/loan-applications'),
            $fetch('/api/repayments'),
            $fetch('/api/approvals'),
            $fetch('/api/schedules'),
            $fetch('/api/payroll')
        ])
        setUsers(usersData as any[])
        if (dashboardData) {
            setDashboard(dashboardData as any)
        }
        if (loanTypesData) {
            setLoanTypes(loanTypesData as any[])
        }
        if (applicationsData) {
            setApplications(applicationsData as any[])
        }
        if (repaymentsData) {
            setTransactions(repaymentsData as any[])
        }
        if (approvalsData) {
            setSteps(approvalsData as any[])
        }
        if (schedulesData) {
            setSchedules(schedulesData as any[])
        }
        if (payrollData) {
            setDeductions(payrollData as any[])
        }
    }

    /**
     * Clear all local storage data
     */
    const resetAll = async () => {
        clearUsers(true)
        clearDashboard(true)
        clearLoanTypes(true)
        clearApplications(true)
        clearTransactions(true)
        clearSteps(true)
        clearSchedules(true)
        clearDeductions(true)
    }

    const { users } = useUsers()
    const isDemoDataSeeded = computed(() => users.value.length > 0)

    return {
        isDemoDataSeeded,
        seedAll,
        resetAll
    }
}

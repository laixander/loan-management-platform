// ============================================================================
// Composable: useLoanTypes
// ============================================================================
// Handover Ready Pattern: Abstracts the data fetching and persistence layer.
// To switch to a real backend, replace localStorage logic with $fetch or useAsyncData.

import type { LoanType } from '~/types'

const STORAGE_KEY = 'demo-loan-types'

export const useLoanTypes = () => {
    // ============================================================================
    // State
    // ============================================================================
    const loanTypes = useState<LoanType[]>('loan-types', () => [])
    const isLoading = useState('loan-types-loading', () => false)
    const isHydrated = ref(false)
    const toast = useAppToast()
    const { logLoanTypeCreated, logLoanTypeUpdated, logLoanTypeDeleted, logLoanTypeCleared } = useAppLogger()

    const isPending = computed(() => !isHydrated.value || isLoading.value)

    // ============================================================================
    // Internal Helpers
    // ============================================================================

    /**
     * Simulate network latency for realistic UX.
     */
    const simulateLoading = async (ms = 500) => {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, ms))
        isLoading.value = false
    }

    /**
     * Save data to reactive state and local storage.
     */
    const saveToStorage = (data: LoanType[]) => {
        loanTypes.value = data
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }

    // ============================================================================
    // Initialization
    // ============================================================================

    /**
     * Load initial data from local storage.
     */
    const load = () => {
        if (import.meta.server) return
        const stored = localStorage.getItem(STORAGE_KEY)
        loanTypes.value = stored ? JSON.parse(stored) : []
        isHydrated.value = true
    }

    // Initialize on client mount
    if (import.meta.client && !isHydrated.value) {
        onMounted(load)
    }

    // ============================================================================
    // CRUD Operations
    // ============================================================================

    /**
     * Add a new loan type to the database.
     */
    const addLoanType = async (form: Omit<LoanType, 'id' | 'createdAt' | 'updatedAt' | 'activeLoans' | 'totalDisbursed'>) => {
        await simulateLoading()
        const newId = loanTypes.value.length > 0 ? Math.max(...loanTypes.value.map(l => l.id)) + 1 : 1
        const newRecord: LoanType = {
            id: newId,
            ...form,
            activeLoans: 0,
            totalDisbursed: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        saveToStorage([newRecord, ...loanTypes.value])
        toast.success('Loan Type added', `The loan type "${newRecord.name}" has been created.`)
        logLoanTypeCreated(newRecord.name)
        return newRecord
    }

    /**
     * Update an existing loan type in the database.
     */
    const updateLoanType = async (id: number, form: Omit<Partial<LoanType>, 'id' | 'createdAt' | 'updatedAt'>) => {
        await simulateLoading()
        const index = loanTypes.value.findIndex(l => l.id === id)
        if (index !== -1) {
            const updatedList = [...loanTypes.value]
            updatedList[index] = {
                ...updatedList[index],
                ...form,
                updatedAt: new Date().toISOString()
            } as LoanType
            saveToStorage(updatedList)
            toast.success('Loan Type updated', `The configuration for "${updatedList[index].name}" has been updated.`)
            logLoanTypeUpdated(updatedList[index].name)
        }
    }

    /**
     * Delete a loan type from the database.
     */
    const deleteLoanType = async (id: number) => {
        await simulateLoading()
        const target = loanTypes.value.find(l => l.id === id)
        if (target) {
            saveToStorage(loanTypes.value.filter(l => l.id !== id))
            toast.success('Loan Type deleted', `The loan type "${target.name}" has been removed.`)
            logLoanTypeDeleted(target.name)
        }
    }

    /**
     * Mass assign loan types (used by demo seeder).
     */
    const setLoanTypes = (data: LoanType[]) => {
        saveToStorage(data)
    }

    /**
     * Clear all loan types from the database.
     */
    const clear = (quiet = false) => {
        loanTypes.value = []
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
        if (!quiet) {
            toast.success('Loan Types cleared', 'All loan type configurations have been removed.')
            logLoanTypeCleared()
        }
    }

    return {
        loanTypes,
        isLoading,
        isPending,
        load,
        addLoanType,
        updateLoanType,
        deleteLoanType,
        setLoanTypes,
        clear
    }
}

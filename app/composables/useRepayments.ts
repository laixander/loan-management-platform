// ============================================================================
// Composable: useRepayments
// ============================================================================
// Manages the ledger of all loan transactions (disbursements, repayments).

import type { LoanTransaction, TransactionType, LoanApplication } from '~/types'

const STORAGE_KEY = 'demo-repayments'

export const useRepayments = () => {
    // ============================================================================
    // State
    // ============================================================================
    const transactions = useState<LoanTransaction[]>('repayments', () => [])
    const isLoading = useState('repayments-loading', () => false)
    const isHydrated = ref(false)
    const toast = useAppToast()
    const { logRepaymentRecorded, logRepaymentCleared } = useAppLogger()

    const isPending = computed(() => !isHydrated.value || isLoading.value)

    // ============================================================================
    // Internal Helpers
    // ============================================================================

    const simulateLoading = async (ms = 500) => {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, ms))
        isLoading.value = false
    }

    const saveToStorage = (data: LoanTransaction[]) => {
        transactions.value = data
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }

    // ============================================================================
    // Initialization
    // ============================================================================

    const load = () => {
        if (import.meta.server) return
        const stored = localStorage.getItem(STORAGE_KEY)
        transactions.value = stored ? JSON.parse(stored) : []
        isHydrated.value = true
    }

    if (import.meta.client && !isHydrated.value) {
        onMounted(load)
    }

    // ============================================================================
    // CRUD Operations (Append-only Ledger)
    // ============================================================================

    const recordTransaction = async (
        application: LoanApplication, 
        type: TransactionType, 
        amount: number, 
        description: string | null
    ) => {
        await simulateLoading()

        // Calculate running balance for this specific loan
        const history = transactions.value
            .filter(t => t.loanApplicationId === application.id)
            .sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime())
        
        const lastTransaction = history.length > 0 ? history[history.length - 1] : null
        const balanceBefore = lastTransaction ? lastTransaction.balanceAfter : 0
        
        // Calculate balance effect
        // Disbursements, Penalties, Adjustments usually INCREASE the owed balance.
        // Repayments, Waivers, Settlements DECREASE the owed balance.
        const decreasesBalance = ['Repayment', 'Waiver', 'Settlement'].includes(type)
        const balanceAfter = decreasesBalance ? (balanceBefore - amount) : (balanceBefore + amount)

        const newId = transactions.value.length > 0 ? Math.max(...transactions.value.map(t => t.id)) + 1 : 1
        
        const newRecord: LoanTransaction = {
            id: newId,
            loanApplicationId: application.id,
            loanRef: application.loanRef,
            transactionType: type,
            amount,
            balanceBefore,
            balanceAfter,
            description,
            transactionDate: new Date().toISOString()
        }

        saveToStorage([newRecord, ...transactions.value])
        toast.success('Transaction Recorded', `Successfully recorded ₱${amount.toLocaleString()} for ${application.loanRef}.`)
        logRepaymentRecorded(type, amount, application.loanRef)
        return newRecord
    }

    const setTransactions = (data: LoanTransaction[]) => {
        saveToStorage(data)
    }

    const clear = (quiet = false) => {
        transactions.value = []
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
        if (!quiet) {
            toast.success('Ledger Cleared', 'All transactions have been removed.')
            logRepaymentCleared()
        }
    }

    return {
        transactions,
        isLoading,
        isPending,
        load,
        recordTransaction,
        setTransactions,
        clear
    }
}

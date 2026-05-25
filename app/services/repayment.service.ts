import { useRepaymentStore } from '~/stores/repayment.store'
import type { LoanTransaction, TransactionType, LoanApplication } from '~/types'
import { useAppToast } from '~/composables/useAppToast'
import { useAppLogger } from '~/composables/useAppLogger'

export const RepaymentService = {
    async simulateLoading(ms = 500) {
        await new Promise(resolve => setTimeout(resolve, ms))
    },

    async recordTransaction(
        application: LoanApplication, 
        type: TransactionType, 
        amount: number, 
        description: string | null
    ) {
        await this.simulateLoading()

        const store = useRepaymentStore()
        const toast = useAppToast()
        const { logRepaymentRecorded } = useAppLogger()

        // Calculate running balance for this specific loan
        const history = store.transactions
            .filter(t => t.loanApplicationId === application.id)
            .sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime())
        
        const lastTransaction = history.length > 0 ? history[history.length - 1] : null
        const balanceBefore = lastTransaction ? lastTransaction.balanceAfter : 0
        
        // Calculate balance effect
        const decreasesBalance = ['Repayment', 'Waiver', 'Settlement'].includes(type)
        const balanceAfter = decreasesBalance ? (balanceBefore - amount) : (balanceBefore + amount)

        const newId = store.transactions.length > 0 ? Math.max(...store.transactions.map(t => t.id)) + 1 : 1
        
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

        store.setTransactions([newRecord, ...store.transactions])
        
        if (import.meta.client) {
            toast.success('Transaction Recorded', `Successfully recorded ₱${amount.toLocaleString()} for ${application.loanRef}.`)
        }
        logRepaymentRecorded(type, amount, application.loanRef)
        
        return newRecord
    }
}

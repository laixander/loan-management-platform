import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '~/core/storage'
import type { LoanTransaction } from '~/types'

export const useRepaymentStore = defineStore('repayment', () => {
    const storage = useStorage()
    
    // State
    const transactions = ref<LoanTransaction[]>([])
    const isHydrated = ref(false)
    
    // Actions
    const hydrate = () => {
        if (import.meta.server) return
        
        const stored = storage.getItem<LoanTransaction[]>('demo-repayments')
        if (stored) {
            transactions.value = stored
        }
        
        isHydrated.value = true
    }

    const setTransactions = (data: LoanTransaction[]) => {
        transactions.value = data
        storage.setItem('demo-repayments', data)
    }

    const addTransactions = (newTransactions: LoanTransaction[]) => {
        const current = [...transactions.value, ...newTransactions]
        setTransactions(current)
    }

    return {
        transactions,
        isHydrated,
        hydrate,
        setTransactions,
        addTransactions
    }
})

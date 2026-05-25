import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '~/core/storage'
import type { PayrollDeduction } from '~/types'

export const usePayrollStore = defineStore('payroll', () => {
    const storage = useStorage()
    
    // State
    const deductions = ref<PayrollDeduction[]>([])
    const isHydrated = ref(false)
    
    // Actions
    const hydrate = () => {
        if (import.meta.server) return
        
        const stored = storage.getItem<PayrollDeduction[]>('demo-payroll-deductions')
        if (stored) {
            deductions.value = stored
        }
        
        isHydrated.value = true
    }

    const setDeductions = (data: PayrollDeduction[]) => {
        deductions.value = data
        storage.setItem('demo-payroll-deductions', data)
    }

    const addDeductions = (newDeductions: PayrollDeduction[]) => {
        const current = [...deductions.value, ...newDeductions]
        setDeductions(current)
    }

    const processDeduction = (id: number) => {
        const index = deductions.value.findIndex(d => d.id === id)
        if (index !== -1) {
            const current = [...deductions.value]
            const deduction = current[index]!
            current[index] = { ...deduction, status: 'Processed', processedDate: new Date().toISOString() }
            setDeductions(current)
        }
    }

    return {
        deductions,
        isHydrated,
        hydrate,
        setDeductions,
        addDeductions,
        processDeduction
    }
})

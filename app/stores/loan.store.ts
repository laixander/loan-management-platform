import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '~/core/storage'
import type { LoanApplication, LoanType, RepaymentSchedule } from '~/types'

export const useLoanStore = defineStore('loan', () => {
    const storage = useStorage()
    
    // State
    const applications = ref<LoanApplication[]>([])
    const types = ref<LoanType[]>([])
    const schedules = ref<RepaymentSchedule[]>([])
    
    const isHydrated = ref(false)
    
    // Actions
    const hydrate = () => {
        if (import.meta.server) return
        
        const storedApps = storage.getItem<LoanApplication[]>('demo-loan-applications')
        if (storedApps) applications.value = storedApps
            
        const storedTypes = storage.getItem<LoanType[]>('demo-loan-types')
        if (storedTypes) types.value = storedTypes
            
        const storedSchedules = storage.getItem<RepaymentSchedule[]>('demo-schedules')
        if (storedSchedules) schedules.value = storedSchedules
        
        isHydrated.value = true
    }

    const setApplications = (data: LoanApplication[]) => {
        applications.value = data
        storage.setItem('demo-loan-applications', data)
    }

    const setTypes = (data: LoanType[]) => {
        types.value = data
        storage.setItem('demo-loan-types', data)
    }

    const setSchedules = (data: RepaymentSchedule[]) => {
        schedules.value = data
        storage.setItem('demo-schedules', data)
    }

    const addSchedules = (newSchedules: RepaymentSchedule[]) => {
        const current = [...schedules.value, ...newSchedules]
        setSchedules(current)
    }

    return {
        applications,
        types,
        schedules,
        isHydrated,
        hydrate,
        setApplications,
        setTypes,
        setSchedules,
        addSchedules
    }
})

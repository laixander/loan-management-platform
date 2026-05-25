import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '~/core/storage'
import type { DashboardData } from '~/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
    const storage = useStorage()
    
    // State
    const data = ref<DashboardData | null>(null)
    const isHydrated = ref(false)
    
    // Actions
    const hydrate = () => {
        if (import.meta.server) return
        
        const stored = storage.getItem<DashboardData>('demo-dashboard')
        if (stored) {
            data.value = stored
        }
        
        isHydrated.value = true
    }

    const setData = (dashboardData: DashboardData | null) => {
        data.value = dashboardData
        if (dashboardData) {
            storage.setItem('demo-dashboard', dashboardData)
        } else {
            storage.removeItem('demo-dashboard')
        }
    }

    return {
        data,
        isHydrated,
        hydrate,
        setData
    }
})

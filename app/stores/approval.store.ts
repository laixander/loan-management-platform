import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '~/core/storage'
import type { ApprovalStep } from '~/types'

export const useApprovalStore = defineStore('approval', () => {
    const storage = useStorage()
    
    // State
    const steps = ref<ApprovalStep[]>([])
    const isHydrated = ref(false)
    
    // Actions
    const hydrate = () => {
        if (import.meta.server) return
        
        const stored = storage.getItem<ApprovalStep[]>('demo-approvals')
        if (stored) {
            steps.value = stored
        }
        
        isHydrated.value = true
    }

    const setSteps = (data: ApprovalStep[]) => {
        steps.value = data
        storage.setItem('demo-approvals', data)
    }

    return {
        steps,
        isHydrated,
        hydrate,
        setSteps
    }
})

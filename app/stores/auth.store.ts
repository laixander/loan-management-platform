import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '~/core/storage'
import type { SystemRole } from '~/types'
import { useAppToast } from '~/composables/useAppToast'

export const useAuthStore = defineStore('auth', () => {
    const storage = useStorage()
    const toast = useAppToast()
    
    // State
    const currentRole = ref<SystemRole | null>(null)
    const currentEmployeeId = ref<number | null>(null)
    const showAllPages = ref<boolean>(false)
    const isHydrated = ref(false)
    
    // Actions
    const hydrate = () => {
        if (import.meta.server) return
        
        const storedRole = storage.getItem<SystemRole>('demo-role')
        if (storedRole) {
            currentRole.value = storedRole
        }
        
        const storedEmployee = storage.getItem<number>('demo-employee-id')
        if (storedEmployee) {
            currentEmployeeId.value = storedEmployee
        }
        
        isHydrated.value = true
    }

    const setRole = (role: SystemRole) => {
        currentRole.value = role
        if (import.meta.client) {
            storage.setItem('demo-role', role)
            
            // Auto-assign employee ID if employee role is selected
            if (role === 'Employee') {
                currentEmployeeId.value = 1
                storage.setItem('demo-employee-id', 1)
            } else {
                currentEmployeeId.value = null
                storage.removeItem('demo-employee-id')
            }

            toast.success('Role Switched', `You are now interacting as ${role}.`)
        }
    }

    const logout = () => {
        currentRole.value = null
        currentEmployeeId.value = null
        storage.removeItem('demo-role')
        storage.removeItem('demo-employee-id')
        if (import.meta.client) {
            toast.success('Logged Out', 'Your session has ended.')
        }
    }

    const setShowAllPages = (value: boolean) => {
        showAllPages.value = value
    }

    return {
        currentRole,
        currentEmployeeId,
        showAllPages,
        isHydrated,
        hydrate,
        setRole,
        logout,
        setShowAllPages
    }
})

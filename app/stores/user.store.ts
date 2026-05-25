import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '~/core/storage'
import type { User } from '~/types'

export const useUserStore = defineStore('user', () => {
    const storage = useStorage()
    
    // State
    const users = ref<User[]>([])
    const isHydrated = ref(false)
    const isLoading = ref(false)
    
    // Actions
    const hydrate = () => {
        if (import.meta.server) return
        
        const stored = storage.getItem<User[]>('demo-users')
        if (stored) {
            users.value = stored
        }
        
        isHydrated.value = true
    }

    const setUsers = (data: User[]) => {
        users.value = data
        storage.setItem('demo-users', data)
    }
    
    return {
        users,
        isHydrated,
        isLoading,
        hydrate,
        setUsers
    }
})

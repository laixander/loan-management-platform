import { useAuthStore } from '~/stores/auth.store'
import type { SystemRole } from '~/types'

export const AuthService = {
    setRole(role: SystemRole) {
        const store = useAuthStore()
        store.setRole(role)
    },

    setShowAllPages(value: boolean) {
        const store = useAuthStore()
        store.setShowAllPages(value)
    }
}

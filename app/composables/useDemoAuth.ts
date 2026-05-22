// ============================================================================
// Composable: useDemoAuth
// ============================================================================
// Simulates a user session and role-based access for the demo.

import type { ApprovalRole } from '~/types'

export type SystemRole = ApprovalRole | 'Employee'

const STORAGE_KEY = 'demo-auth-role'

export const useDemoAuth = () => {
    // Default to null — user must select a role on the login page
    const currentRole = useState<SystemRole | null>('demo-auth-role', () => null)
    const isHydrated = ref(false)
    const toast = useAppToast()

    const load = () => {
        if (import.meta.server) return
        const storedRole = localStorage.getItem(STORAGE_KEY) as SystemRole | null
        if (storedRole) {
            currentRole.value = storedRole
        }

        isHydrated.value = true
    }

    if (import.meta.client && !isHydrated.value) {
        onMounted(load)
    }

    const setRole = (role: SystemRole) => {
        currentRole.value = role
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, role)
        }
    }

    const logout = () => {
        currentRole.value = null
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
    }

    // Hardcode Employee ID 1 for Employee simulation mode
    const currentEmployeeId = computed(() => {
        return currentRole.value === 'Employee' ? 1 : null
    })

    const isLoggedIn = computed(() => currentRole.value !== null)

    return {
        currentRole,
        currentEmployeeId,
        isHydrated,
        isLoggedIn,
        setRole,
        logout
    }
}

// ============================================================================
// Composable: useDemoAuth
// ============================================================================
// Simulates a user session and role-based access for the demo.

import type { ApprovalRole } from '~/types'

export type SystemRole = ApprovalRole | 'Employee'

const STORAGE_KEY = 'demo-auth-role'

export const useDemoAuth = () => {
    // We default to 'Admin' which has full access to view everything.
    const currentRole = useState<SystemRole>('demo-auth-role', () => 'Admin')
    const showAllPages = useState<boolean>('demo-auth-show-all', () => false)
    const isHydrated = ref(false)
    const toast = useAppToast()

    const load = () => {
        if (import.meta.server) return
        const storedRole = localStorage.getItem(STORAGE_KEY) as SystemRole
        if (storedRole) {
            currentRole.value = storedRole
        }
        
        const storedShowAll = localStorage.getItem('demo-auth-show-all')
        if (storedShowAll !== null) {
            showAllPages.value = storedShowAll === 'true'
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
        toast.success('Role Switched', `You are now interacting as ${role}.`)
    }

    const toggleShowAllPages = () => {
        showAllPages.value = !showAllPages.value
        if (import.meta.client) {
            localStorage.setItem('demo-auth-show-all', String(showAllPages.value))
        }
    }

    // Hardcode Employee ID 1 for Employee simulation mode
    const currentEmployeeId = computed(() => {
        return currentRole.value === 'Employee' ? 1 : null
    })

    return {
        currentRole,
        currentEmployeeId,
        showAllPages,
        isHydrated,
        setRole,
        toggleShowAllPages
    }
}

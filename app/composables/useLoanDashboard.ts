// ============================================================================
// Composable: useLoanDashboard
// ============================================================================
// Handover Ready Pattern: Abstracts the data fetching and persistence layer.
// To switch to a real backend, replace localStorage logic with $fetch or useAsyncData.

import type { DashboardData } from '~/types/dashboard'

const STORAGE_KEY = 'demo-dashboard'

export const useLoanDashboard = () => {
    // ============================================================================
    // State
    // ============================================================================
    const dashboard = useState<DashboardData | null>('dashboard', () => null)
    const isLoading = useState('dashboard-loading', () => false)
    const isHydrated = ref(false)
    const toast = useAppToast()

    const isPending = computed(() => !isHydrated.value || isLoading.value)
    const hasData = computed(() => !!dashboard.value)

    // ============================================================================
    // Internal Helpers
    // ============================================================================

    /**
     * Simulate network latency for realistic UX.
     */
    const simulateLoading = async (ms = 500) => {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, ms))
        isLoading.value = false
    }

    /**
     * Save data to reactive state and local storage.
     */
    const saveToStorage = (data: DashboardData | null) => {
        dashboard.value = data
        if (import.meta.client) {
            if (data) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
            } else {
                localStorage.removeItem(STORAGE_KEY)
            }
        }
    }

    // ============================================================================
    // Initialization
    // ============================================================================

    /**
     * Load initial data from local storage.
     */
    const load = () => {
        if (import.meta.server) return
        const stored = localStorage.getItem(STORAGE_KEY)
        dashboard.value = stored ? JSON.parse(stored) : null
        isHydrated.value = true
    }

    // Initialize on client mount
    if (import.meta.client && !isHydrated.value) {
        onMounted(load)
    }

    // ============================================================================
    // Operations
    // ============================================================================

    /**
     * Mass assign dashboard data (used by demo seeder).
     */
    const setDashboard = (data: DashboardData) => {
        saveToStorage(data)
    }

    /**
     * Clear all dashboard data from the database.
     */
    const clear = (quiet = false) => {
        dashboard.value = null
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
        if (!quiet) {
            toast.success('Dashboard cleared', 'All dashboard data has been removed.')
        }
    }

    return {
        dashboard,
        isLoading,
        isPending,
        hasData,
        load,
        setDashboard,
        clear
    }
}

// ============================================================================
// Composable: useSchedules
// ============================================================================
// Manages the Repayment Schedules for active loans.

import type { RepaymentSchedule } from '~/types'

const STORAGE_KEY = 'demo-schedules'

export const useSchedules = () => {
    const schedules = useState<RepaymentSchedule[]>('schedules', () => [])
    const isLoading = useState('schedules-loading', () => false)
    const isHydrated = ref(false)
    const toast = useAppToast()
    const logger = useLogger('schedules')

    const isPending = computed(() => !isHydrated.value || isLoading.value)

    const saveToStorage = (data: RepaymentSchedule[]) => {
        schedules.value = data
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }

    const load = () => {
        if (import.meta.server) return
        const stored = localStorage.getItem(STORAGE_KEY)
        schedules.value = stored ? JSON.parse(stored) : []
        isHydrated.value = true
    }

    if (import.meta.client && !isHydrated.value) {
        onMounted(load)
    }

    const markSchedulePaid = async (id: number) => {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const index = schedules.value.findIndex(s => s.id === id)
        if (index !== -1) {
            const updated = [...schedules.value]
            updated[index] = {
                ...updated[index]!,
                status: 'Paid',
                paidDate: new Date().toISOString()
            }
            saveToStorage(updated)
            logger.addLog(`Marked schedule #${id} as Paid`, 'schedule.paid', 'success')
        }
        isLoading.value = false
    }

    const setSchedules = (data: RepaymentSchedule[]) => {
        saveToStorage(data)
    }

    const clear = (quiet = false) => {
        schedules.value = []
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
        if (!quiet) {
            toast.success('Schedules Cleared', 'All schedules reset.')
        }
    }

    return {
        schedules,
        isLoading,
        isPending,
        load,
        markSchedulePaid,
        setSchedules,
        clear
    }
}

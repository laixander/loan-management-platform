// ============================================================================
// Composable: useApprovals
// ============================================================================
// Manages the multi-step approval workflow.

import type { ApprovalStep, ApprovalStatus, LoanApplication } from '~/types'

const STORAGE_KEY = 'demo-approvals'

export const useApprovals = () => {
    // ============================================================================
    // State
    // ============================================================================
    const steps = useState<ApprovalStep[]>('approvals', () => [])
    const isLoading = useState('approvals-loading', () => false)
    const isHydrated = ref(false)
    const toast = useAppToast()
    const { logApprovalProcessed, logApprovalCleared } = useAppLogger()

    const isPending = computed(() => !isHydrated.value || isLoading.value)

    const { updateApplication, applications } = useLoanApplications()

    // ============================================================================
    // Internal Helpers
    // ============================================================================

    const simulateLoading = async (ms = 500) => {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, ms))
        isLoading.value = false
    }

    const saveToStorage = (data: ApprovalStep[]) => {
        steps.value = data
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }

    // ============================================================================
    // Initialization
    // ============================================================================

    const load = () => {
        if (import.meta.server) return
        const stored = localStorage.getItem(STORAGE_KEY)
        steps.value = stored ? JSON.parse(stored) : []
        isHydrated.value = true
    }

    if (import.meta.client && !isHydrated.value) {
        onMounted(load)
    }

    // ============================================================================
    // Workflow Actions
    // ============================================================================

    const processStep = async (stepId: number, outcome: ApprovalStatus, comments: string | null) => {
        await simulateLoading()
        const index = steps.value.findIndex(s => s.id === stepId)
        if (index === -1) return

        const currentStep = steps.value[index]!
        const updatedStep = { 
            ...currentStep, 
            status: outcome, 
            comments, 
            actionDate: new Date().toISOString() 
        }

        const updatedList = [...steps.value]
        updatedList[index] = updatedStep
        saveToStorage(updatedList)

        toast.success('Step Processed', `Marked as ${outcome} for ${currentStep.loanRef}`)
        logApprovalProcessed(currentStep.stepOrder, currentStep.role, outcome, currentStep.loanRef)

        // Workflow Automation: Update the parent loan application status
        const app = applications.value.find(a => a.id === currentStep.loanApplicationId)
        if (!app) return

        if (outcome === 'Rejected') {
            // Immediate rejection
            await updateApplication(app.id, { status: 'Rejected' })
        } else if (outcome === 'Approved') {
            // Check if there are more steps pending
            const siblingSteps = updatedList.filter(s => s.loanApplicationId === app.id)
            const allApproved = siblingSteps.every(s => s.status === 'Approved')
            
            if (allApproved) {
                await updateApplication(app.id, { status: 'Approved' })
            }
        }
    }

    const setSteps = (data: ApprovalStep[]) => {
        saveToStorage(data)
    }

    const clear = (quiet = false) => {
        steps.value = []
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
        if (!quiet) {
            toast.success('Approvals Cleared', 'All workflows reset.')
            logApprovalCleared()
        }
    }

    return {
        steps,
        isLoading,
        isPending,
        load,
        processStep,
        setSteps,
        clear
    }
}

// ============================================================================
// Composable: useLoanApplications
// ============================================================================
// Handover Ready Pattern: Abstracts the data fetching and persistence layer.

import type { LoanApplication, LoanStatus } from '~/types'

const STORAGE_KEY = 'demo-loan-applications'

export const useLoanApplications = () => {
    // ============================================================================
    // State
    // ============================================================================
    const applications = useState<LoanApplication[]>('loan-applications', () => [])
    const isLoading = useState('loan-applications-loading', () => false)
    const isHydrated = ref(false)
    const toast = useAppToast()
    const { logApplicationCreated, logApplicationStatusChanged, logApplicationUpdated, logApplicationDeleted, logApplicationCleared } = useAppLogger()

    const isPending = computed(() => !isHydrated.value || isLoading.value)

    // ============================================================================
    // Internal Helpers
    // ============================================================================

    const simulateLoading = async (ms = 500) => {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, ms))
        isLoading.value = false
    }

    const saveToStorage = (data: LoanApplication[]) => {
        applications.value = data
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }
    
    // Auto-generate LN-YYYY-XXX string
    const generateLoanRef = () => {
        const year = new Date().getFullYear()
        const currentYearApps = applications.value.filter(a => a.loanRef.includes(`LN-${year}-`))
        const sequence = currentYearApps.length + 1
        return `LN-${year}-${sequence.toString().padStart(3, '0')}`
    }

    // ============================================================================
    // Initialization
    // ============================================================================

    const load = () => {
        if (import.meta.server) return
        const stored = localStorage.getItem(STORAGE_KEY)
        applications.value = stored ? JSON.parse(stored) : []
        isHydrated.value = true
    }

    if (import.meta.client && !isHydrated.value) {
        onMounted(load)
    }

    // ============================================================================
    // CRUD Operations
    // ============================================================================

    const addApplication = async (form: Omit<LoanApplication, 'id' | 'loanRef' | 'applicationDate' | 'approvalDate' | 'disbursementDate' | 'completionDate'>) => {
        await simulateLoading()
        const newId = applications.value.length > 0 ? Math.max(...applications.value.map(a => a.id)) + 1 : 1
        const loanRef = generateLoanRef()
        
        const newRecord: LoanApplication = {
            id: newId,
            loanRef,
            ...form,
            applicationDate: new Date().toISOString(),
            approvalDate: form.status === 'Approved' ? new Date().toISOString() : null,
            disbursementDate: form.status === 'Disbursed' ? new Date().toISOString() : null,
            completionDate: form.status === 'Completed' ? new Date().toISOString() : null,
        }

        saveToStorage([newRecord, ...applications.value])
        toast.success('Application Submitted', `Loan reference ${loanRef} has been created.`)
        logApplicationCreated(loanRef, form.employeeName)
        return newRecord
    }

    const updateApplication = async (id: number, form: Partial<LoanApplication>) => {
        await simulateLoading()
        const current = applications.value.find(a => a.id === id)
        if (current) {
            const index = applications.value.indexOf(current)
            const updated = { ...current, ...form }
            
            // Auto-timestamp status changes
            if (form.status && form.status !== current.status) {
                const now = new Date().toISOString()
                if (form.status === 'Approved') updated.approvalDate = now
                if (form.status === 'Disbursed') updated.disbursementDate = now
                if (form.status === 'Completed') updated.completionDate = now
                logApplicationStatusChanged(current.loanRef, form.status)
            } else {
                logApplicationUpdated(current.loanRef)
            }

            const updatedList = [...applications.value]
            updatedList[index] = updated
            saveToStorage(updatedList)
            toast.success('Application Updated', `Details for ${current.loanRef} have been updated.`)
        }
    }

    const deleteApplication = async (id: number) => {
        await simulateLoading()
        const target = applications.value.find(a => a.id === id)
        if (target) {
            saveToStorage(applications.value.filter(a => a.id !== id))
            toast.success('Application Deleted', `Loan application ${target.loanRef} has been removed.`)
            logApplicationDeleted(target.loanRef)
        }
    }

    const setApplications = (data: LoanApplication[]) => {
        saveToStorage(data)
    }

    const clear = (quiet = false) => {
        applications.value = []
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
        if (!quiet) {
            toast.success('Applications Cleared', 'All loan applications have been removed.')
            logApplicationCleared()
        }
    }

    return {
        applications,
        isLoading,
        isPending,
        load,
        addApplication,
        updateApplication,
        deleteApplication,
        setApplications,
        clear
    }
}

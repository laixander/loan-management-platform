import { useLoanStore } from '~/stores/loan.store'
import { useApprovalStore } from '~/stores/approval.store'
import type { LoanApplication, RepaymentSchedule, ApprovalRole, ApprovalStep } from '~/types'
import { useAppToast } from '~/composables/useAppToast'
import { useAppLogger } from '~/composables/useAppLogger'
import { FinanceService } from './finance.service'

export const LoanService = {
    async simulateLoading(ms = 500) {
        await new Promise(resolve => setTimeout(resolve, ms))
    },

    generateLoanRef() {
        const store = useLoanStore()
        const year = new Date().getFullYear()
        const currentYearApps = store.applications.filter(a => a.loanRef.includes(`LN-${year}-`))
        const sequence = currentYearApps.length + 1
        return `LN-${year}-${sequence.toString().padStart(3, '0')}`
    },

    async applyForLoan(form: Omit<LoanApplication, 'id' | 'loanRef' | 'applicationDate' | 'approvalDate' | 'disbursementDate' | 'completionDate'>) {
        await this.simulateLoading()
        
        const store = useLoanStore()
        const toast = useAppToast()
        const { logApplicationCreated } = useAppLogger()

        const newId = store.applications.length > 0 ? Math.max(...store.applications.map(a => a.id)) + 1 : 1
        const loanRef = this.generateLoanRef()
        
        const newRecord: LoanApplication = {
            id: newId,
            loanRef,
            ...form,
            applicationDate: new Date().toISOString(),
            approvalDate: form.status === 'Approved' ? new Date().toISOString() : null,
            disbursementDate: form.status === 'Disbursed' ? new Date().toISOString() : null,
            completionDate: form.status === 'Completed' ? new Date().toISOString() : null,
        }

        store.setApplications([newRecord, ...store.applications])
        
        // --- PHASE 2 CORE WORKFLOW: Generate Approval Steps ---
        if (form.status === 'Pending' || form.status === 'Under Review') {
            const approvalStore = useApprovalStore()
            
            // Generate standard 3-step approval
            const roles: ApprovalRole[] = ['Supervisor', 'HR', 'Finance']
            const startId = approvalStore.steps.length > 0 ? Math.max(...approvalStore.steps.map(s => s.id)) + 1 : 1
            
            const newSteps: ApprovalStep[] = roles.map((role, idx) => ({
                id: startId + idx,
                loanApplicationId: newId,
                loanRef: loanRef,
                employeeName: form.employeeName,
                requestedAmount: form.requestedAmount,
                stepOrder: idx + 1,
                role: role,
                approverId: null,
                status: 'Pending',
                comments: null,
                actionDate: null
            }))
            
            approvalStore.setSteps([...newSteps, ...approvalStore.steps])
        }
        // -----------------------------------------------------
        
        if (import.meta.client) {
            toast.success('Application Submitted', `Loan reference ${loanRef} has been created.`)
        }
        logApplicationCreated(loanRef, form.employeeName)
        
        return newRecord
    },

    async updateApplication(id: number, form: Partial<LoanApplication>) {
        await this.simulateLoading()
        
        const store = useLoanStore()
        const toast = useAppToast()
        const { logApplicationStatusChanged, logApplicationUpdated } = useAppLogger()

        const current = store.applications.find(a => a.id === id)
        if (current) {
            const index = store.applications.indexOf(current)
            const updated = { ...current, ...form }
            
            // Auto-timestamp status changes
            if (form.status && form.status !== current.status) {
                const now = new Date().toISOString()
                if (form.status === 'Approved') updated.approvalDate = now
                if (form.status === 'Disbursed') {
                    updated.disbursementDate = now
                    // --- PHASE 3 FINANCIAL ENGINE: Generate Schedule ---
                    FinanceService.generateAmortizationSchedule(updated)
                }
                if (form.status === 'Completed') updated.completionDate = now
                logApplicationStatusChanged(current.loanRef, form.status)
                
                // --- PHASE 2 CORE WORKFLOW: Handle Forced Approval/Rejection ---
                if (form.status === 'Approved' || form.status === 'Rejected') {
                    const approvalStore = useApprovalStore()
                    const pendingSteps = approvalStore.steps.filter(s => s.loanApplicationId === id && s.status === 'Pending')
                    
                    if (pendingSteps.length > 0) {
                        const updatedSteps = approvalStore.steps.map(s => {
                            if (s.loanApplicationId === id && s.status === 'Pending') {
                                return {
                                    ...s,
                                    status: form.status === 'Approved' ? 'Skipped' : 'Rejected',
                                    comments: `Automatically ${form.status === 'Approved' ? 'skipped' : 'rejected'} due to administrative override.`,
                                    actionDate: now
                                } as ApprovalStep
                            }
                            return s
                        })
                        approvalStore.setSteps(updatedSteps)
                    }
                }
                // ---------------------------------------------------------------
            } else {
                logApplicationUpdated(current.loanRef)
            }

            const updatedList = [...store.applications]
            updatedList[index] = updated
            store.setApplications(updatedList)
            
            if (import.meta.client) {
                toast.success('Application Updated', `Details for ${current.loanRef} have been updated.`)
            }
        }
    },

    async deleteApplication(id: number) {
        await this.simulateLoading()
        
        const store = useLoanStore()
        const toast = useAppToast()
        const { logApplicationDeleted } = useAppLogger()

        const target = store.applications.find(a => a.id === id)
        if (target) {
            store.setApplications(store.applications.filter(a => a.id !== id))
            if (import.meta.client) {
                toast.success('Application Deleted', `Loan application ${target.loanRef} has been removed.`)
            }
            logApplicationDeleted(target.loanRef)
        }
    },

    async markSchedulePaid(id: number) {
        await this.simulateLoading(300)
        
        const store = useLoanStore()
        const { logSchedulePaid } = useAppLogger()

        const index = store.schedules.findIndex(s => s.id === id)
        if (index !== -1) {
            const updated = [...store.schedules]
            updated[index] = {
                ...updated[index]!,
                status: 'Paid',
                paidDate: new Date().toISOString()
            }
            store.setSchedules(updated)
            logSchedulePaid(id)
        }
    },

    async addLoanType(form: any) {
        await this.simulateLoading()
        
        const store = useLoanStore()
        const toast = useAppToast()
        const { logLoanTypeCreated } = useAppLogger()

        const newId = store.types.length > 0 ? Math.max(...store.types.map(l => l.id)) + 1 : 1
        const newRecord = {
            id: newId,
            ...form,
            activeLoans: 0,
            totalDisbursed: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        store.setTypes([newRecord, ...store.types])
        
        if (import.meta.client) {
            toast.success('Loan Type added', `The loan type "${newRecord.name}" has been created.`)
        }
        logLoanTypeCreated(newRecord.name)
        
        return newRecord
    },

    async updateLoanType(id: number, form: any) {
        await this.simulateLoading()
        
        const store = useLoanStore()
        const toast = useAppToast()
        const { logLoanTypeUpdated } = useAppLogger()

        const index = store.types.findIndex(l => l.id === id)
        if (index !== -1) {
            const updatedList = [...store.types]
            const updatedType = {
                ...updatedList[index]!,
                ...form,
                updatedAt: new Date().toISOString()
            }
            updatedList[index] = updatedType
            store.setTypes(updatedList)
            
            if (import.meta.client) {
                toast.success('Loan Type updated', `The configuration for "${updatedType.name}" has been updated.`)
            }
            logLoanTypeUpdated(updatedType.name)
        }
    },

    async deleteLoanType(id: number) {
        await this.simulateLoading()
        
        const store = useLoanStore()
        const toast = useAppToast()
        const { logLoanTypeDeleted } = useAppLogger()

        const target = store.types.find(l => l.id === id)
        if (target) {
            store.setTypes(store.types.filter(l => l.id !== id))
            if (import.meta.client) {
                toast.success('Loan Type deleted', `The loan type "${target.name}" has been removed.`)
            }
            logLoanTypeDeleted(target.name)
        }
    }
}

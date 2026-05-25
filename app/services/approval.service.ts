import { useApprovalStore } from '~/stores/approval.store'
import { useLoanStore } from '~/stores/loan.store'
import type { ApprovalStatus } from '~/types'
import { useAppToast } from '~/composables/useAppToast'
import { useAppLogger } from '~/composables/useAppLogger'
import { LoanService } from './loan.service'

export const ApprovalService = {
    async simulateLoading(ms = 500) {
        await new Promise(resolve => setTimeout(resolve, ms))
    },

    async processStep(stepId: number, outcome: ApprovalStatus, comments: string | null) {
        await this.simulateLoading()

        const store = useApprovalStore()
        const loanStore = useLoanStore()
        const toast = useAppToast()
        const { logApprovalProcessed } = useAppLogger()

        const index = store.steps.findIndex(s => s.id === stepId)
        if (index === -1) return

        const currentStep = store.steps[index]!
        const updatedStep = { 
            ...currentStep, 
            status: outcome, 
            comments, 
            actionDate: new Date().toISOString() 
        }

        const updatedList = [...store.steps]
        updatedList[index] = updatedStep
        store.setSteps(updatedList)

        if (import.meta.client) {
            toast.success('Step Processed', `Marked as ${outcome} for ${currentStep.loanRef}`)
        }
        logApprovalProcessed(currentStep.stepOrder, currentStep.role, outcome, currentStep.loanRef)

        // Workflow Automation: Update the parent loan application status
        const app = loanStore.applications.find(a => a.id === currentStep.loanApplicationId)
        if (!app) return

        if (outcome === 'Rejected') {
            // Immediate rejection
            await LoanService.updateApplication(app.id, { status: 'Rejected' })
        } else if (outcome === 'Approved') {
            // Check if there are more steps pending
            const siblingSteps = updatedList.filter(s => s.loanApplicationId === app.id)
            const allApproved = siblingSteps.every(s => s.status === 'Approved')
            
            if (allApproved) {
                await LoanService.updateApplication(app.id, { status: 'Disbursed' })
            }
        }
    }
}

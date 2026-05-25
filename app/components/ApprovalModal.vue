<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { reactive, watch, useTemplateRef, computed } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { ApprovalStep, ApprovalStatus } from '~/types'

// ============================================================================
// Component Definition
// ============================================================================
interface Props {
    step: ApprovalStep | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'submit', form: { status: ApprovalStatus; comments: string | null }): void
    (e: 'cancel'): void
}>()

// ============================================================================
// Composables
// ============================================================================
const userStore = useUserStore()
const loanStore = useLoanStore()

// ============================================================================
// State
// ============================================================================
const isOpen = defineModel<boolean>('open', { default: false })
const formRef = useTemplateRef('form')

const schema = z.object({
    status: z.enum(['Approved', 'Rejected'], { message: 'You must select a decision.' }),
    comments: z.string().nullish()
}).refine(data => {
    // Require comments if rejected
    if (data.status === 'Rejected' && (!data.comments || data.comments.trim() === '')) {
        return false
    }
    return true
}, {
    message: 'Comments are required when rejecting an application.',
    path: ['comments']
})

type Schema = z.output<typeof schema>

const form = reactive({
    status: 'Approved' as 'Approved' | 'Rejected',
    comments: undefined as string | undefined
})

// Reset form when modal opens
watch(() => props.step, (newVal) => {
    if (newVal) resetForm()
})

// ============================================================================
// Computations for Context
// ============================================================================
const parentApplication = computed(() => {
    if (!props.step) return null
    return loanStore.applications.find(a => a.id === props.step!.loanApplicationId)
})

const applicant = computed(() => {
    if (!parentApplication.value) return null
    return userStore.users.find(u => u.id === parentApplication.value!.employeeId)
})

const activeLoans = computed(() => {
    if (!applicant.value) return []
    return loanStore.applications.filter(a => a.employeeId === applicant.value!.id && a.status === 'Active')
})

const currentMonthlyObligations = computed(() => {
    return activeLoans.value.reduce((total, loan) => total + (loan.monthlyAmortization || 0), 0)
})

const projectedAmortization = computed(() => {
    if (!parentApplication.value) return 0
    return parentApplication.value.monthlyAmortization || 0
})

const totalProjectedObligations = computed(() => currentMonthlyObligations.value + projectedAmortization.value)

const dsr = computed(() => {
    if (!applicant.value || !applicant.value.baseSalary) return 0
    return (totalProjectedObligations.value / applicant.value.baseSalary) * 100
})

const dsrColor = computed(() => {
    if (dsr.value > 40) return 'error'
    if (dsr.value >= 30) return 'warning'
    return 'success'
})

// ============================================================================
// Methods
// ============================================================================

function onSubmit(event: FormSubmitEvent<Schema>) {
    emit('submit', { 
        status: event.data.status,
        comments: event.data.comments ?? null
    })
    resetForm()
    isOpen.value = false
}

function onCancel() {
    resetForm()
    isOpen.value = false
    emit('cancel')
}

function resetForm() {
    form.status = 'Approved'
    form.comments = undefined
    formRef.value?.clear()
}
</script>

<template>
    <UModal v-model:open="isOpen" :ui="{ content: 'w-full sm:max-w-4xl' }">
        <template #content="{ close }">
            <div class="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800" v-if="step && applicant && parentApplication">
                
                <!-- LEFT COLUMN: Applicant Context -->
                <div class="flex-1 p-6 bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Applicant Profile</h3>
                        <p class="text-muted text-sm">{{ applicant.name }} • {{ applicant.role }}</p>
                    </div>

                    <!-- Financial Context -->
                    <div class="grid grid-cols-2 gap-4">
                        <UCard variant="subtle" class="shadow-sm">
                            <p class="text-xs text-muted mb-1">Base Salary</p>
                            <p class="font-semibold text-lg text-gray-900 dark:text-white">₱{{ applicant.baseSalary?.toLocaleString() ?? 0 }}</p>
                        </UCard>
                        <UCard variant="subtle" class="shadow-sm">
                            <p class="text-xs text-muted mb-1">Hire Date</p>
                            <p class="font-semibold text-lg text-gray-900 dark:text-white">{{ new Date(applicant.hireDate).toLocaleDateString() }}</p>
                        </UCard>
                    </div>

                    <!-- DSR Section -->
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between items-end">
                            <h4 class="font-medium text-gray-900 dark:text-white">Debt Service Ratio (DSR)</h4>
                            <span class="text-lg font-bold" :class="`text-${dsrColor}-500`">{{ dsr.toFixed(1) }}%</span>
                        </div>
                        <UProgress :model-value="dsr" :max="100" :color="dsrColor" class="h-2" />
                        <div class="flex justify-between text-xs text-muted mt-1">
                            <span>0%</span>
                            <span>Warning: 40%</span>
                        </div>
                    </div>
                    
                    <!-- Obligations Breakdown -->
                    <div class="text-sm flex flex-col gap-2 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                        <div class="flex justify-between text-muted">
                            <span>Existing Active Loans ({{ activeLoans.length }})</span>
                            <span>₱{{ currentMonthlyObligations.toLocaleString() }} / mo</span>
                        </div>
                        <div class="flex justify-between text-muted">
                            <span>Requested Application</span>
                            <span class="text-primary font-medium">+ ₱{{ projectedAmortization.toLocaleString() }} / mo</span>
                        </div>
                        <div class="flex justify-between font-semibold pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                            <span>Total Projected Obligations</span>
                            <span>₱{{ totalProjectedObligations.toLocaleString() }} / mo</span>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: Approval Form -->
                <div class="flex-1 p-6 flex flex-col gap-6 relative">
                    <!-- Close Button -->
                    <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="absolute top-2 right-2" @click="close" />
                    
                    <!-- Header -->
                    <div class="flex flex-col gap-1 pr-8">
                        <h3 class="text-lg font-semibold">Review Application</h3>
                        <p class="text-muted text-sm">You are evaluating this application as <span class="font-bold text-primary">{{ step.role }}</span>.</p>
                    </div>

                    <!-- Application Summary -->
                    <div class="bg-muted/30 p-3 rounded-md flex flex-col gap-2 text-sm border border-gray-100 dark:border-gray-800">
                        <div class="flex justify-between">
                            <span class="text-muted">Loan Ref:</span>
                            <span class="font-medium">{{ step.loanRef }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted">Requested Amount:</span>
                            <span class="font-medium text-primary">₱{{ step.requestedAmount.toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted">Term:</span>
                            <span class="font-medium">{{ parentApplication.termMonths }} Months</span>
                        </div>
                    </div>

                    <!-- Form Content -->
                    <UForm ref="form" :state="form" :schema="schema" class="flex flex-col gap-4 mt-auto" @submit="onSubmit">
                        
                        <UFormField label="Your Decision" name="status">
                            <URadioGroup v-model="form.status" :items="[{ label: 'Approve', value: 'Approved' }, { label: 'Reject', value: 'Rejected' }]" orientation="horizontal" class="w-full" />
                        </UFormField>

                        <UFormField label="Comments (Required if rejecting)" name="comments">
                            <UTextarea v-model="form.comments" placeholder="Provide your feedback here..." class="w-full" />
                        </UFormField>

                        <!-- Actions -->
                        <div class="flex justify-end gap-2 pt-4">
                            <UButton label="Cancel" color="neutral" variant="ghost" @click="onCancel" />
                            <UButton type="submit" label="Submit Decision" color="primary" icon="i-lucide-check-circle" />
                        </div>
                    </UForm>
                </div>
            </div>
            
            <!-- Fallback if data is missing -->
            <div v-else class="p-6 text-center text-muted">
                Unable to load applicant data.
                <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="absolute top-2 right-2" @click="close" />
            </div>
        </template>
    </UModal>
</template>

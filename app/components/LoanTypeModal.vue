<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { reactive, watch, useTemplateRef } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { LoanType } from '~/types'

// ============================================================================
// Component Definition
// ============================================================================
interface Props {
    title?: string
    loanType?: LoanType
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Loan Type Details'
})

const emit = defineEmits<{
    (e: 'submit', loanType: Omit<LoanType, 'id' | 'createdAt' | 'updatedAt' | 'activeLoans' | 'totalDisbursed'>): void
    (e: 'cancel'): void
}>()

// ============================================================================
// State
// ============================================================================
const isOpen = defineModel<boolean>('open', { default: false })
const interestMethods = ['flat', 'diminishing', 'fixed']
const formRef = useTemplateRef('form')

const schema = z.object({
    name: z.string({ message: 'Name is required' }).min(1, 'Name is required'),
    description: z.string().optional(),
    maxAmount: z.number({ message: 'Must be a number' }).min(1, 'Must be greater than 0'),
    minTenureMonths: z.number({ message: 'Must be a number' }).min(0, 'Cannot be negative'),
    interestRate: z.number({ message: 'Must be a number' }).min(0, 'Cannot be negative'),
    interestMethod: z.enum(['flat', 'diminishing', 'fixed'], { message: 'Required' }),
    maxRepaymentMonths: z.number({ message: 'Must be a number' }).min(1, 'Must be greater than 0'),
    isActive: z.boolean()
})

type Schema = z.output<typeof schema>

const form = reactive({
    name: props.loanType?.name || '',
    description: props.loanType?.description || '',
    maxAmount: props.loanType?.maxAmount || 0,
    minTenureMonths: props.loanType?.minTenureMonths || 0,
    interestRate: props.loanType?.interestRate || 0,
    interestMethod: props.loanType?.interestMethod || 'diminishing' as const,
    maxRepaymentMonths: props.loanType?.maxRepaymentMonths || 12,
    isActive: props.loanType?.isActive ?? true
})

// Sync form with props when loanType changes
watch(() => props.loanType, (newVal) => {
    if (newVal) {
        form.name = newVal.name
        form.description = newVal.description
        form.maxAmount = newVal.maxAmount
        form.minTenureMonths = newVal.minTenureMonths
        form.interestRate = newVal.interestRate
        form.interestMethod = newVal.interestMethod
        form.maxRepaymentMonths = newVal.maxRepaymentMonths
        form.isActive = newVal.isActive
    } else {
        resetForm()
    }
}, { deep: true, immediate: true })

// ============================================================================
// Methods
// ============================================================================

/**
 * Handle form submission
 */
function onSubmit(event: FormSubmitEvent<Schema>) {
    emit('submit', { 
        ...event.data, 
        description: event.data.description || '',
        requiredDocuments: props.loanType?.requiredDocuments || [] 
    })
    resetForm()
    isOpen.value = false
}

/**
 * Handle modal cancellation
 */
function onCancel() {
    resetForm()
    isOpen.value = false
    emit('cancel')
}

/**
 * Reset form fields to default state
 */
function resetForm() {
    form.name = ''
    form.description = ''
    form.maxAmount = 0
    form.minTenureMonths = 0
    form.interestRate = 0
    form.interestMethod = 'diminishing'
    form.maxRepaymentMonths = 12
    form.isActive = true
    formRef.value?.clear()
}
</script>

<template>
    <UModal v-model:open="isOpen" :ui="{ content: 'w-full sm:max-w-xl' }">
        <template #content="{ close }">
            <div class="flex flex-col gap-6 p-4 sm:p-6">
                <!-- Header -->
                <div class="flex flex-col gap-1">
                    <h3 class="text-lg font-semibold">{{ title }}</h3>
                    <p class="text-muted text-sm">{{ loanType ? 'Update the details for this loan type.' : 'Configure a new loan product offering.' }}</p>
                </div>

                <!-- Form Content -->
                <UForm ref="form" :state="form" :schema="schema" class="flex flex-col gap-4" @submit="onSubmit">
                    
                    <UFormField label="Name" name="name">
                        <UInput v-model="form.name" placeholder="Salary Loan" icon="i-lucide-bookmark" class="w-full" />
                    </UFormField>

                    <UFormField label="Description" name="description">
                        <UTextarea v-model="form.description" placeholder="Brief description of the loan purpose" class="w-full" />
                    </UFormField>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Max Amount (₱)" name="maxAmount">
                            <UInput v-model.number="form.maxAmount" type="number" icon="i-lucide-philippine-peso" class="w-full" />
                        </UFormField>
                        
                        <UFormField label="Min Tenure (Months)" name="minTenureMonths">
                            <UInput v-model.number="form.minTenureMonths" type="number" icon="i-lucide-calendar" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Interest Rate (%)" name="interestRate">
                            <UInput v-model.number="form.interestRate" type="number" icon="i-lucide-percent" class="w-full" />
                        </UFormField>
                        
                        <UFormField label="Interest Method" name="interestMethod">
                            <USelect v-model="form.interestMethod" :items="interestMethods" class="w-full" />
                        </UFormField>
                    </div>

                    <UFormField label="Max Term (Months)" name="maxRepaymentMonths">
                        <UInput v-model.number="form.maxRepaymentMonths" type="number" icon="i-lucide-clock" class="w-full" />
                    </UFormField>

                    <UFormField label="Status" name="isActive" class="mt-2">
                        <USwitch v-model="form.isActive" size="sm" :label="form.isActive ? 'Active' : 'Inactive'" />
                    </UFormField>

                    <!-- Actions -->
                    <div class="flex justify-end gap-2 pt-2">
                        <UButton label="Cancel" color="neutral" variant="ghost" @click="onCancel" />
                        <UButton type="submit" :label="loanType ? 'Save Changes' : 'Create Loan Type'" color="primary" 
                            :icon="loanType ? 'i-lucide-save' : 'i-lucide-plus'" />
                    </div>
                </UForm>
            </div>

            <!-- Close Button -->
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="absolute top-2 right-2" @click="close" />
        </template>
    </UModal>
</template>

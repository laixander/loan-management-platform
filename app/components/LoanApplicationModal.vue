<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { reactive, watch, useTemplateRef, computed } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { LoanApplication, LoanStatus } from '~/types'

// ============================================================================
// Component Definition
// ============================================================================
interface Props {
    title?: string
    application?: LoanApplication
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Loan Application Details'
})

const emit = defineEmits<{
    (e: 'submit', application: Omit<LoanApplication, 'id' | 'loanRef' | 'applicationDate' | 'approvalDate' | 'disbursementDate' | 'completionDate'>): void
    (e: 'cancel'): void
}>()

// ============================================================================
// Composables
// ============================================================================
const { users } = useUsers()
const { loanTypes } = useLoanTypes()

// ============================================================================
// State
// ============================================================================
const isOpen = defineModel<boolean>('open', { default: false })
const formRef = useTemplateRef('form')

const statusOptions: LoanStatus[] = [
    'Draft', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Disbursed', 'Active', 'Completed', 'Defaulted'
]

const schema = z.object({
    employeeId: z.number().min(1, 'Employee is required'),
    loanTypeId: z.number().min(1, 'Loan Type is required'),
    requestedAmount: z.number({ message: 'Must be a number' }).min(1, 'Must be greater than 0'),
    approvedAmount: z.number().nullable(),
    termMonths: z.number({ message: 'Must be a number' }).min(1, 'Must be greater than 0'),
    interestRate: z.number({ message: 'Must be a number' }).min(0, 'Cannot be negative'),
    monthlyAmortization: z.number().nullable(),
    status: z.enum(['Draft', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Disbursed', 'Active', 'Completed', 'Defaulted']),
    remarks: z.string().nullish()
})

type Schema = z.output<typeof schema>

const form = reactive({
    employeeId: props.application?.employeeId || 0,
    loanTypeId: props.application?.loanTypeId || 0,
    requestedAmount: props.application?.requestedAmount || 0,
    approvedAmount: props.application?.approvedAmount || null,
    termMonths: props.application?.termMonths || 0,
    interestRate: props.application?.interestRate || 0,
    monthlyAmortization: props.application?.monthlyAmortization || null,
    status: props.application?.status || 'Draft' as LoanStatus,
    remarks: props.application?.remarks ?? undefined
})

// Options for USelectMenu
const employeeOptions = computed(() => users.value.map(u => ({ label: u.name, value: u.id })))
const loanTypeOptions = computed(() => loanTypes.value.map(lt => ({ label: lt.name, value: lt.id })))

// ============================================================================
// Watchers for Auto-Calculation
// ============================================================================

// Auto-fill Interest Rate when Loan Type changes
watch(() => form.loanTypeId, (newId) => {
    // Only auto-fill if we're creating a new one, or if they explicitly changed it
    if (!props.application || props.application.loanTypeId !== newId) {
        const selectedType = loanTypes.value.find(lt => lt.id === newId)
        if (selectedType) {
            form.interestRate = selectedType.interestRate
            // Optional: Set default term if 0
            if (form.termMonths === 0) form.termMonths = selectedType.maxRepaymentMonths
        }
    }
})

// Sync form with props when application changes
watch(() => props.application, (newVal) => {
    if (newVal) {
        form.employeeId = newVal.employeeId
        form.loanTypeId = newVal.loanTypeId
        form.requestedAmount = newVal.requestedAmount
        form.approvedAmount = newVal.approvedAmount
        form.termMonths = newVal.termMonths
        form.interestRate = newVal.interestRate
        form.monthlyAmortization = newVal.monthlyAmortization
        form.status = newVal.status
        form.remarks = newVal.remarks ?? undefined
    } else {
        resetForm()
    }
}, { deep: true, immediate: true })

// ============================================================================
// Methods
// ============================================================================

function onSubmit(event: FormSubmitEvent<Schema>) {
    // Denormalize the names
    const employee = users.value.find(u => u.id === event.data.employeeId)
    const loanType = loanTypes.value.find(lt => lt.id === event.data.loanTypeId)

    emit('submit', { 
        ...event.data,
        employeeName: employee?.name || 'Unknown Employee',
        loanType: loanType?.name || 'Unknown Type',
        remarks: event.data.remarks ?? null
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
    form.employeeId = 0
    form.loanTypeId = 0
    form.requestedAmount = 0
    form.approvedAmount = null
    form.termMonths = 0
    form.interestRate = 0
    form.monthlyAmortization = null
    form.status = 'Draft'
    form.remarks = undefined
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
                    <p class="text-muted text-sm">{{ application ? 'Update the details of this loan application.' : 'File a new loan application.' }}</p>
                </div>

                <!-- Form Content -->
                <UForm ref="form" :state="form" :schema="schema" class="flex flex-col gap-4" @submit="onSubmit">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Employee" name="employeeId">
                            <USelect v-model.number="form.employeeId" :items="employeeOptions" class="w-full" />
                        </UFormField>

                        <UFormField label="Loan Type" name="loanTypeId">
                            <USelect v-model.number="form.loanTypeId" :items="loanTypeOptions" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Requested Amount (₱)" name="requestedAmount">
                            <UInput v-model.number="form.requestedAmount" type="number" icon="i-lucide-philippine-peso" class="w-full" />
                        </UFormField>
                        
                        <UFormField label="Term (Months)" name="termMonths">
                            <UInput v-model.number="form.termMonths" type="number" icon="i-lucide-calendar" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Approved Amount (₱)" name="approvedAmount">
                            <UInput v-model.number="form.approvedAmount" type="number" icon="i-lucide-philippine-peso" class="w-full" placeholder="Optional" />
                        </UFormField>
                        
                        <UFormField label="Interest Rate (%)" name="interestRate">
                            <UInput v-model.number="form.interestRate" type="number" icon="i-lucide-percent" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Monthly Amortization (₱)" name="monthlyAmortization">
                            <UInput v-model.number="form.monthlyAmortization" type="number" icon="i-lucide-philippine-peso" class="w-full" placeholder="Optional" />
                        </UFormField>
                        
                        <UFormField label="Status" name="status">
                            <USelect v-model="form.status" :items="statusOptions" class="w-full" />
                        </UFormField>
                    </div>

                    <UFormField label="Remarks" name="remarks">
                        <UTextarea v-model="form.remarks" placeholder="Add any notes or comments here" class="w-full" />
                    </UFormField>

                    <!-- Actions -->
                    <div class="flex justify-end gap-2 pt-2">
                        <UButton label="Cancel" color="neutral" variant="ghost" @click="onCancel" />
                        <UButton type="submit" :label="application ? 'Save Changes' : 'Submit Application'" color="primary" 
                            :icon="application ? 'i-lucide-save' : 'i-lucide-send'" />
                    </div>
                </UForm>
            </div>

            <!-- Close Button -->
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="absolute top-2 right-2" @click="close" />
        </template>
    </UModal>
</template>

<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { reactive, watch, useTemplateRef, computed } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { TransactionType } from '~/types'

// ============================================================================
// Component Definition
// ============================================================================
interface Props {
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Record Transaction'
})

const emit = defineEmits<{
    (e: 'submit', form: { loanApplicationId: number; transactionType: TransactionType; amount: number; description: string | null }): void
    (e: 'cancel'): void
}>()

// ============================================================================
// Composables
// ============================================================================
const loanStore = useLoanStore()
const repaymentStore = useRepaymentStore()

// Filter for active loans
const activeLoans = computed(() => {
    return loanStore.applications.filter(a => ['Approved', 'Disbursed', 'Active'].includes(a.status))
})

const loanOptions = computed(() => {
    return activeLoans.value.map(a => ({
        label: `${a.loanRef} - ${a.employeeName} (${a.loanType})`,
        value: a.id
    }))
})

// Calculate current balance based on transactions for a loan
const calculateBalance = (appId: number) => {
    const history = repaymentStore.transactions
        .filter(t => t.loanApplicationId === appId)
        .sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime())
    
    if (history.length === 0) return 0
    const lastItem = history[history.length - 1]
    return lastItem ? lastItem.balanceAfter : 0
}

// ============================================================================
// State
// ============================================================================
const isOpen = defineModel<boolean>('open', { default: false })
const formRef = useTemplateRef('form')

const typeOptions: TransactionType[] = [
    'Disbursement', 'Repayment', 'Adjustment', 'Penalty', 'Waiver', 'Settlement'
]

const schema = z.object({
    loanApplicationId: z.number().min(1, 'Please select a loan application'),
    transactionType: z.enum(['Disbursement', 'Repayment', 'Adjustment', 'Penalty', 'Waiver', 'Settlement']),
    amount: z.number({ message: 'Must be a number' }).min(1, 'Amount must be greater than 0'),
    description: z.string().nullish()
})

type Schema = z.output<typeof schema>

const form = reactive({
    loanApplicationId: 0,
    transactionType: 'Repayment' as TransactionType,
    amount: 0,
    description: undefined as string | undefined
})

const selectedLoanBalance = computed(() => {
    if (form.loanApplicationId === 0) return 0
    return calculateBalance(form.loanApplicationId)
})

// ============================================================================
// Methods
// ============================================================================

function onSubmit(event: FormSubmitEvent<Schema>) {
    emit('submit', { 
        ...event.data,
        description: event.data.description ?? null
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
    form.loanApplicationId = 0
    form.transactionType = 'Repayment'
    form.amount = 0
    form.description = undefined
    formRef.value?.clear()
}
</script>

<template>
    <UModal v-model:open="isOpen" :ui="{ content: 'w-full sm:max-w-md' }">
        <template #content="{ close }">
            <div class="flex flex-col gap-6 p-4 sm:p-6">
                <!-- Header -->
                <div class="flex flex-col gap-1">
                    <h3 class="text-lg font-semibold">{{ title }}</h3>
                    <p class="text-muted text-sm">Manually record a repayment or ledger entry.</p>
                </div>

                <!-- Form Content -->
                <UForm ref="form" :state="form" :schema="schema" class="flex flex-col gap-4" @submit="onSubmit">
                    
                    <UFormField label="Target Loan Application" name="loanApplicationId">
                        <USelect v-model.number="form.loanApplicationId" :items="loanOptions" class="w-full" placeholder="Select an active loan..." />
                    </UFormField>

                    <div v-if="form.loanApplicationId > 0" class="text-xs text-muted">
                        Current Outstanding Balance: <span class="font-bold text-primary">₱{{ selectedLoanBalance.toLocaleString() }}</span>
                    </div>

                    <UFormField label="Transaction Type" name="transactionType">
                        <USelect v-model="form.transactionType" :items="typeOptions" class="w-full" />
                    </UFormField>

                    <UFormField label="Amount (₱)" name="amount">
                        <UInput v-model.number="form.amount" type="number" icon="i-lucide-philippine-peso" class="w-full" />
                    </UFormField>

                    <UFormField label="Description / Remarks" name="description">
                        <UTextarea v-model="form.description" placeholder="Optional notes about this transaction..." class="w-full" />
                    </UFormField>

                    <!-- Actions -->
                    <div class="flex justify-end gap-2 pt-2">
                        <UButton label="Cancel" color="neutral" variant="ghost" @click="onCancel" />
                        <UButton type="submit" label="Record Transaction" color="primary" icon="i-lucide-check-circle" />
                    </div>
                </UForm>
            </div>

            <!-- Close Button -->
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="absolute top-2 right-2" @click="close" />
        </template>
    </UModal>
</template>

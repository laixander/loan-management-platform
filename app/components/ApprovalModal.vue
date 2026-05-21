<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { reactive, useTemplateRef } from 'vue'
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
    <UModal v-model:open="isOpen" :ui="{ content: 'w-full sm:max-w-md' }">
        <template #content="{ close }">
            <div class="flex flex-col gap-6 p-4 sm:p-6" v-if="step">
                <!-- Header -->
                <div class="flex flex-col gap-1">
                    <h3 class="text-lg font-semibold">Review Application</h3>
                    <p class="text-muted text-sm">You are evaluating this application as <span class="font-bold text-primary">{{ step.role }}</span>.</p>
                </div>

                <!-- Application Summary (Read-only context) -->
                <div class="bg-muted/30 p-3 rounded-md flex flex-col gap-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted">Applicant:</span>
                        <span class="font-medium">{{ step.employeeName }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted">Loan Ref:</span>
                        <span class="font-medium">{{ step.loanRef }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted">Amount:</span>
                        <span class="font-medium text-primary">₱{{ step.requestedAmount.toLocaleString() }}</span>
                    </div>
                </div>

                <!-- Form Content -->
                <UForm ref="form" :state="form" :schema="schema" class="flex flex-col gap-4" @submit="onSubmit">
                    
                    <UFormField label="Your Decision" name="status">
                        <URadioGroup v-model="form.status" :items="[{ label: 'Approve', value: 'Approved' }, { label: 'Reject', value: 'Rejected' }]" orientation="horizontal" class="w-full" />
                    </UFormField>

                    <UFormField label="Comments (Required if rejecting)" name="comments">
                        <UTextarea v-model="form.comments" placeholder="Provide your feedback here..." class="w-full" />
                    </UFormField>

                    <!-- Actions -->
                    <div class="flex justify-end gap-2 pt-2">
                        <UButton label="Cancel" color="neutral" variant="ghost" @click="onCancel" />
                        <UButton type="submit" label="Submit Decision" color="primary" icon="i-lucide-check-circle" />
                    </div>
                </UForm>
            </div>

            <!-- Close Button -->
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="absolute top-2 right-2" @click="close" />
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { reactive, watch, useTemplateRef } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { User, SystemRole } from '~/types'

interface Props {
    title?: string
    user?: User
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Employee Details'
})

const emit = defineEmits<{
    (e: 'submit', user: Omit<User, 'id'>): void
    (e: 'cancel'): void
}>()

const isOpen = defineModel<boolean>('open', { default: false })
const formRef = useTemplateRef('form')

const roleOptions: SystemRole[] = ['Employee', 'Supervisor', 'HR', 'Finance', 'Payroll', 'Admin']

const schema = z.object({
    name: z.string({ message: 'Name is required' }).min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['Employee', 'Supervisor', 'HR', 'Finance', 'Payroll', 'Admin'], { message: 'Required' }),
    baseSalary: z.number().min(0, 'Must be positive'),
    hireDate: z.string().min(1, 'Hire date is required'),
    status: z.enum(['Active', 'Inactive'])
})

type Schema = z.output<typeof schema>

const form = reactive({
    name: props.user?.name || '',
    email: props.user?.email || '',
    role: (props.user?.role as SystemRole) || 'Employee',
    baseSalary: props.user?.baseSalary || 30000,
    hireDate: props.user?.hireDate || new Date().toISOString().split('T')[0],
    status: props.user?.status || 'Active'
})

watch(() => props.user, (newVal) => {
    if (newVal) {
        form.name = newVal.name
        form.email = newVal.email
        form.role = newVal.role as SystemRole
        form.baseSalary = newVal.baseSalary
        form.hireDate = newVal.hireDate.split('T')[0]! // Simple date format for input type="date"
        form.status = newVal.status
    } else {
        resetForm()
    }
}, { deep: true, immediate: true })

function onSubmit(event: FormSubmitEvent<Schema>) {
    emit('submit', { 
        ...event.data,
        // Add time back to hireDate if needed, or leave as simple date
        hireDate: event.data.hireDate.includes('T') ? event.data.hireDate : `${event.data.hireDate}T00:00:00Z`
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
    form.name = ''
    form.email = ''
    form.role = 'Employee'
    form.baseSalary = 30000
    form.hireDate = new Date().toISOString().split('T')[0]!
    form.status = 'Active'
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
                    <p class="text-muted text-sm">{{ user ? 'Update employee profile and roles.' : 'Add a new employee to the directory.' }}</p>
                </div>

                <!-- Form Content -->
                <UForm ref="form" :state="form" :schema="schema" class="flex flex-col gap-4" @submit="onSubmit">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Full Name" name="name">
                            <UInput v-model="form.name" placeholder="John Doe" icon="i-lucide-user" class="w-full" />
                        </UFormField>
                        
                        <UFormField label="Email" name="email">
                            <UInput v-model="form.email" type="email" placeholder="john@example.com" icon="i-lucide-mail" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="System Role" name="role">
                            <USelect v-model="form.role" :items="roleOptions" class="w-full" />
                        </UFormField>
                        
                        <UFormField label="Status" name="status">
                            <USelect v-model="form.status" :items="['Active', 'Inactive']" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Base Salary (₱)" name="baseSalary">
                            <UInput v-model.number="form.baseSalary" type="number" icon="i-lucide-philippine-peso" class="w-full" />
                        </UFormField>
                        
                        <UFormField label="Hire Date" name="hireDate">
                            <UInput v-model="form.hireDate" type="date" icon="i-lucide-calendar" class="w-full" />
                        </UFormField>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-2 pt-2">
                        <UButton label="Cancel" color="neutral" variant="ghost" @click="onCancel" />
                        <UButton type="submit" :label="user ? 'Save Changes' : 'Add Employee'" color="primary" 
                            :icon="user ? 'i-lucide-save' : 'i-lucide-plus'" />
                    </div>
                </UForm>
            </div>

            <!-- Close Button -->
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="absolute top-2 right-2" @click="close" />
        </template>
    </UModal>
</template>

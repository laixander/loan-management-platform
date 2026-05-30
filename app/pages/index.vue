<script setup lang="ts">
import type { SystemRole } from '~/types'

definePageMeta({
    layout: false
})

const authStore = useAuthStore()
const router = useRouter()

const selectedRole = ref<SystemRole | undefined>(undefined)
const roleOptions: { label: string, value: SystemRole, description: string, icon: string }[] = [
    { label: 'Admin', value: 'Admin', description: 'System configuration and oversight', icon: 'i-lucide-shield-check' },
    { label: 'Employee', value: 'Employee', description: 'Self-service loan applications and history', icon: 'i-lucide-user' },
    { label: 'Finance', value: 'Finance', description: 'Loan funding, repayments & reports', icon: 'i-lucide-circle-dollar-sign' },
    { label: 'HR', value: 'HR', description: 'Employee verification & directory', icon: 'i-lucide-users' },
    { label: 'Payroll', value: 'Payroll', description: 'Deductions & salary integrations', icon: 'i-lucide-calculator' },
    { label: 'Supervisor', value: 'Supervisor', description: 'Loan approvals and team management', icon: 'i-lucide-briefcase' }
]

const handleLogin = () => {
    if (!selectedRole.value) return
    authStore.setRole(selectedRole.value)
    router.push('/dashboard')
}
</script>
<template>
    <div class="fixed inset-0 flex justify-center items-center bg-neutral-50 dark:bg-neutral-950">
        <UCard class="w-full max-w-sm shadow-sm">
            <header class="space-y-3 text-center">
                <div class="flex items-center justify-center gap-2">
                    <UIcon name="i-lucide-hand-coins" class="size-8 text-primary" />
                    <span class="text-2xl font-black tracking-tight">Loan<span
                            class="text-primary">Management</span></span>
                </div>
                <div class="text-sm text-muted text-pretty">A Financial Wellness Solution for Employee</div>
            </header>
            <USeparator class="my-6" />
            <main class="space-y-4 mt-10">
                <UFormField label="Username">
                    <UInput placeholder="Enter your username" variant="soft" size="lg" class="w-full" />
                </UFormField>
                <UFormField label="Password">
                    <UInput placeholder="Enter your password" variant="soft" size="lg" type="password" class="w-full" />
                </UFormField>
                <!-- <UFormField label="User Role">
                    <USelect v-model="selectedRole" placeholder="Select your role" :items="roleOptions" variant="soft" size="lg" class="w-full" />
                </UFormField> -->
                <UFormField label="Department Role">
                    <USelect v-model="selectedRole" placeholder="Select your role"
                        :items="roleOptions.map(r => ({ label: r.label, value: r.value }))" variant="soft" size="lg"
                        class="w-full" />
                </UFormField>
                <!-- Role preview card -->
                <Transition name="fade" mode="out-in">
                    <div v-if="selectedRole"
                        class="flex items-center gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
                        <UIcon
                            :name="roleOptions.find(r => r.value === selectedRole)?.icon || 'i-lucide-user'"
                            class="size-5 text-primary shrink-0" />
                        <div>
                            <div class="text-sm font-semibold text-primary">{{ selectedRole }}</div>
                            <div class="text-xs text-muted">
                                {{ roleOptions.find(r => r.value === selectedRole)?.description }}
                            </div>
                        </div>
                    </div>
                </Transition>
                <UButton label="Login" size="lg" class="justify-center" block :disabled="!selectedRole" @click="handleLogin" />
            </main>
            <footer class="text-center mt-8">
                <ULink as="button" class="text-sm">Forgot Password?</ULink>
            </footer>
        </UCard>
    </div>
</template>

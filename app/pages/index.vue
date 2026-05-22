<script setup lang="ts">
import type { SystemRole } from '~/composables/useDemoAuth'

definePageMeta({
    layout: false
})

const { setRole } = useDemoAuth()
const router = useRouter()

const selectedRole = ref<SystemRole | undefined>(undefined)
const roleOptions: SystemRole[] = ['Admin', 'Employee', 'Finance', 'HR', 'Payroll', 'Supervisor']

const handleLogin = () => {
    if (!selectedRole.value) return
    setRole(selectedRole.value)
    router.push('/dashboard')
}
</script>
<template>
    <div class="fixed inset-0 flex justify-center items-center bg-neutral-50 dark:bg-neutral-950">
        <UCard>
            <header class="space-y-2">
                <div class="font-semibold text-xl text-highlighted text-center">Login</div>
                <div class="text-sm text-muted text-center">Enter your credentials to access your account</div>
            </header>
            <main class="space-y-4 mt-10">
                <UFormField label="Username">
                    <UInput placeholder="Enter your username" variant="soft" size="lg" class="w-full" />
                </UFormField>
                <UFormField label="Password">
                    <UInput placeholder="Enter your password" variant="soft" size="lg" type="password" class="w-full" />
                </UFormField>
                <UFormField label="User Role">
                    <USelect v-model="selectedRole" placeholder="Select your role" :items="roleOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>
                <UButton label="Login" size="lg" class="justify-center" block :disabled="!selectedRole" @click="handleLogin" />
            </main>
            <footer class="text-center mt-8">
                <ULink as="button" class="text-sm">Forgot Password?</ULink>
            </footer>
        </UCard>
    </div>
</template>

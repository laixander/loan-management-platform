<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useAppToast } from '~/composables/useAppToast'

definePageMeta({
    title: 'System Settings',
    description: 'Configure global parameters, workflows, and integrations.'
})

const authStore = useAuthStore()
const toast = useAppToast()
const isAuthorized = computed(() => ['Admin'].includes(authStore.currentRole ?? ''))

// Mocked Settings State
const settings = ref({
    autoDisburse: true,
    requireDocuments: true,
    maxConcurrentLoans: 2,
    notifyOnApproval: true,
    notifyOnDisbursement: true,
    maintenanceMode: false
})

const isSaving = ref(false)

async function handleSave() {
    isSaving.value = true
    await new Promise(resolve => setTimeout(resolve, 600))
    toast.success('Settings Saved', 'System configurations have been updated successfully.')
    isSaving.value = false
}
</script>

<template>
    <AuthGate v-if="!isAuthorized" title="Admin Access Required" description="Only System Administrators can modify global settings." icon="i-lucide-lock" />

    <UContainer v-else class="max-w-4xl w-full space-y-6">
        <UPageCard title="System Settings" description="Configure global parameters and workflows." variant="naked"
        orientation="horizontal" class="rounded-none" />

        <ClientOnly>
            <Teleport to="#header-actions-teleport">
                <UButton label="Save Changes" icon="i-lucide-save" color="primary" :loading="isSaving" @click="handleSave" />
            </Teleport>
        </ClientOnly>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">    
            <!-- General Policy Settings -->
            <UCard variant="subtle" class="shadow-sm" :ui="{ root: 'flex flex-col', body: 'flex-1' }">
                <template #header>
                    <h3 class="font-semibold text-lg flex items-center gap-2">
                        <UIcon name="i-lucide-settings" class="w-5 h-5 text-primary" />
                        General Policies
                    </h3>
                </template>
                <div class="space-y-6">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="font-medium">Auto-Disburse on Approval</p>
                            <p class="text-xs text-muted">Automatically change status to Disbursed when fully approved.</p>
                        </div>
                        <USwitch v-model="settings.autoDisburse" />
                    </div>
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="font-medium">Require Documents</p>
                            <p class="text-xs text-muted">Mandate attachments for new loan applications.</p>
                        </div>
                        <USwitch v-model="settings.requireDocuments" />
                    </div>
                </div>
                <template #footer>
                    <UFormField label="Max Concurrent Loans per Employee">
                        <UInput v-model.number="settings.maxConcurrentLoans" type="number" class="w-full" />
                    </UFormField>
                </template>
            </UCard>

            <!-- Notifications & System -->
            <div class="space-y-6">
                <UCard variant="subtle" class="shadow-sm">
                    <template #header>
                        <h3 class="font-semibold text-lg flex items-center gap-2">
                            <UIcon name="i-lucide-bell" class="w-5 h-5 text-primary" />
                            Notifications
                        </h3>
                    </template>
                    <div class="space-y-6">
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <p class="font-medium">Notify on Approval Step</p>
                                <p class="text-xs text-muted">Send email to next approver.</p>
                            </div>
                            <USwitch v-model="settings.notifyOnApproval" />
                        </div>
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <p class="font-medium">Notify on Disbursement</p>
                                <p class="text-xs text-muted">Send SMS/Email to employee.</p>
                            </div>
                            <USwitch v-model="settings.notifyOnDisbursement" />
                        </div>
                    </div>
                </UCard>

                <UCard variant="subtle" class="ring-error-200 dark:ring-error-900 bg-error-50 dark:bg-error-950/10" :ui="{ root: 'divide-error-200 dark:divide-error-900' }">
                    <template #header>
                        <h3 class="font-semibold text-lg flex items-center gap-2 text-error-600 dark:text-error-400">
                            <UIcon name="i-lucide-alert-triangle" class="w-5 h-5" />
                            Danger Zone
                        </h3>
                    </template>
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="font-medium text-error-800 dark:text-error-300">Maintenance Mode</p>
                            <p class="text-xs text-error-600 dark:text-error-400">Disable all new loan applications.</p>
                        </div>
                        <USwitch v-model="settings.maintenanceMode" color="error" />
                    </div>
                </UCard>
            </div>
            
        </div>
    </UContainer>
</template>

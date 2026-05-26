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
    <div v-if="!isAuthorized" class="flex flex-col items-center justify-center h-full flex-1 gap-4 text-center p-6">
        <UIcon name="i-lucide-shield-alert" class="w-16 h-16 text-warning" />
        <h2 class="text-2xl font-bold">Admin Access Required</h2>
        <p class="text-muted">Only System Administrators can modify global settings.</p>
    </div>

    <template v-else>
        <div class="p-6 max-w-4xl mx-auto w-full h-full space-y-6">
            <div class="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">System Settings</h2>
                    <p class="text-muted text-sm mt-1">Configure global parameters and workflows.</p>
                </div>
                <UButton label="Save Changes" icon="i-lucide-save" color="primary" :loading="isSaving" @click="handleSave" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                <!-- General Policy Settings -->
                <UCard class="ring-0 border border-gray-200 dark:border-gray-800 shadow-none">
                    <template #header>
                        <h3 class="font-semibold text-lg flex items-center gap-2">
                            <UIcon name="i-lucide-settings" class="w-5 h-5 text-primary" />
                            General Policies
                        </h3>
                    </template>
                    <div class="space-y-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">Auto-Disburse on Approval</p>
                                <p class="text-xs text-muted">Automatically change status to Disbursed when fully approved.</p>
                            </div>
                            <USwitch v-model="settings.autoDisburse" />
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">Require Documents</p>
                                <p class="text-xs text-muted">Mandate attachments for new loan applications.</p>
                            </div>
                            <USwitch v-model="settings.requireDocuments" />
                        </div>
                        <div class="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <label class="text-sm font-medium">Max Concurrent Loans per Employee</label>
                            <UInput v-model.number="settings.maxConcurrentLoans" type="number" class="w-full" />
                        </div>
                    </div>
                </UCard>

                <!-- Notifications & System -->
                <div class="space-y-6">
                    <UCard class="ring-0 border border-gray-200 dark:border-gray-800 shadow-none">
                        <template #header>
                            <h3 class="font-semibold text-lg flex items-center gap-2">
                                <UIcon name="i-lucide-bell" class="w-5 h-5 text-primary" />
                                Notifications
                            </h3>
                        </template>
                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium">Notify on Approval Step</p>
                                    <p class="text-xs text-muted">Send email to next approver.</p>
                                </div>
                                <USwitch v-model="settings.notifyOnApproval" />
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium">Notify on Disbursement</p>
                                    <p class="text-xs text-muted">Send SMS/Email to employee.</p>
                                </div>
                                <USwitch v-model="settings.notifyOnDisbursement" />
                            </div>
                        </div>
                    </UCard>

                    <UCard class="ring-0 border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/10 shadow-none">
                        <template #header>
                            <h3 class="font-semibold text-lg flex items-center gap-2 text-error-600 dark:text-error-400">
                                <UIcon name="i-lucide-alert-triangle" class="w-5 h-5" />
                                Danger Zone
                            </h3>
                        </template>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium text-error-800 dark:text-error-300">Maintenance Mode</p>
                                <p class="text-xs text-error-600 dark:text-error-400">Disable all new loan applications.</p>
                            </div>
                            <USwitch v-model="settings.maintenanceMode" color="error" />
                        </div>
                    </UCard>
                </div>
                
            </div>
        </div>
    </template>
</template>

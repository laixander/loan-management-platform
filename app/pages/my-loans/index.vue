<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { UBadge, UButton } from '#components'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'My Loans',
    layout: 'default'
})

// ============================================================================
// State
// ============================================================================
const { currentRole, currentEmployeeId } = useDemoAuth()
const { myApplications, isPending } = useMyLoans()

const isEmployeeMode = computed(() => currentRole.value === 'Employee' && currentEmployeeId.value !== null)

function getStatusColor(status: string) {
    switch (status) {
        case 'Active': return 'success'
        case 'Pending':
        case 'Under Review': return 'warning'
        case 'Approved': return 'primary'
        case 'Disbursed': return 'info'
        case 'Rejected': return 'error'
        default: return 'neutral'
    }
}
</script>

<template>
    <div class="p-6 max-w-6xl mx-auto w-full h-full">
        <!-- Auth Gate -->
        <div v-if="!isEmployeeMode" class="flex flex-col items-center justify-center h-full gap-4 text-center">
            <UIcon name="i-lucide-shield-alert" class="w-16 h-16 text-warning" />
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Employee Access Required</h2>
            <p class="text-gray-500 max-w-md">
                This self-service dashboard is only available to employees. 
                Please use the Demo Control Center to switch your role to <span class="font-semibold text-primary">Employee</span>.
            </p>
        </div>

        <!-- Dashboard -->
        <div v-else>
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Loans</h1>
                <p class="text-gray-500">Track and manage your personal loan applications.</p>
            </div>

            <!-- Empty State -->
            <div v-if="!isPending && myApplications.length === 0" class="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <UIcon name="i-lucide-piggy-bank" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">No Active Loans</h3>
                <p class="text-gray-500 mb-6">You don't have any loan applications yet.</p>
                <!-- We will wire this up when we build Apply for Loan -->
                <UButton label="Apply for a Loan" color="primary" disabled />
            </div>

            <!-- Loading State -->
            <div v-else-if="isPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UCard v-for="i in 3" :key="i" class="animate-pulse">
                    <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
                    <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                </UCard>
            </div>

            <!-- Loan Cards -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="app in myApplications" :key="app.id" :to="`/my-loans/${app.id}`" class="block group">
                    <UCard class="h-full transition-all duration-200 hover:shadow-lg hover:border-primary-500/50 cursor-pointer">
                        <template #header>
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ app.loanType }}</h3>
                                    <p class="text-sm text-gray-500">{{ app.loanRef }}</p>
                                </div>
                                <UBadge :label="app.status" :color="getStatusColor(app.status)" variant="subtle" />
                            </div>
                        </template>

                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-gray-500">Requested Amount</p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ app.requestedAmount.toLocaleString() }}</p>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <p class="text-xs text-gray-500 mb-1">Term</p>
                                    <p class="font-medium text-sm">{{ app.termMonths }} Months</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 mb-1">Interest Rate</p>
                                    <p class="font-medium text-sm">{{ app.interestRate }}%</p>
                                </div>
                            </div>
                        </div>

                        <template #footer>
                            <div class="flex justify-between items-center w-full text-sm text-primary font-medium group-hover:text-primary-600">
                                View Details
                                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </template>
                    </UCard>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

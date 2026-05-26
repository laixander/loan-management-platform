<script setup lang="ts">
import { computed } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import { useLoanStore } from '~/stores/loan.store'
import { useUserStore } from '~/stores/user.store'
import { useAuthStore } from '~/stores/auth.store'
import { useChart } from '~/composables/useChart'

definePageMeta({
    title: 'Reports & Analytics',
    description: 'Generate and export financial insights and loan metrics.'
})

const authStore = useAuthStore()
const loanStore = useLoanStore()
const userStore = useUserStore()
const { palette, defaultOptions, doughnutOptions, lineDataset, doughnutDataset } = useChart()

const isAuthorized = computed(() => ['Admin', 'Finance', 'HR'].includes(authStore.currentRole ?? ''))

// Computations
const totalLoans = computed(() => loanStore.applications.length)
const totalDisbursed = computed(() => 
    loanStore.applications
        .filter(a => a.status === 'Disbursed' || a.status === 'Active' || a.status === 'Completed')
        .reduce((sum, a) => sum + (a.approvedAmount || a.requestedAmount), 0)
)
const pendingAmount = computed(() => 
    loanStore.applications
        .filter(a => a.status === 'Pending' || a.status === 'Under Review')
        .reduce((sum, a) => sum + a.requestedAmount, 0)
)

// Status Chart
const statusData = computed(() => {
    const statuses = ['Pending', 'Approved', 'Disbursed', 'Completed', 'Rejected']
    const counts = statuses.map(status => 
        loanStore.applications.filter(a => a.status === status).length
    )
    
    return {
        labels: statuses,
        datasets: [doughnutDataset({
            label: 'Applications',
            data: counts
        })]
    }
})

// Timeline Chart (Mocked trend for now)
const timelineData = computed(() => {
    return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            lineDataset({
                label: 'Applications Received',
                data: [12, 19, 15, totalLoans.value],
                borderColor: palette.blue.solid,
                backgroundColor: palette.blue.soft
            })
        ]
    }
})

function handleExport() {
    const toast = useAppToast()
    toast.success('Report Exported', 'The financial report has been downloaded as CSV.')
}
</script>

<template>
    <div v-if="!isAuthorized" class="flex flex-col items-center justify-center h-full flex-1 gap-4 text-center p-6">
        <UIcon name="i-lucide-shield-alert" class="w-16 h-16 text-warning" />
        <h2 class="text-2xl font-bold">Manager Access Required</h2>
    </div>

    <template v-else>
        <div class="p-6 max-w-7xl mx-auto w-full h-full space-y-6">
            <div class="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
                    <p class="text-muted text-sm mt-1">Export financial data and monitor system KPIs.</p>
                </div>
                <UButton label="Export CSV" icon="i-lucide-download" color="primary" @click="handleExport" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <UCard variant="subtle" class="border border-gray-200 dark:border-gray-800">
                    <p class="text-sm text-muted font-medium mb-1">Total Applications</p>
                    <p class="text-3xl font-bold">{{ totalLoans }}</p>
                </UCard>
                <UCard variant="subtle" class="border border-success-200 dark:border-success-900 bg-success-50 dark:bg-success-950/20">
                    <p class="text-sm text-success-700 dark:text-success-400 font-medium mb-1">Total Disbursed</p>
                    <p class="text-3xl font-bold text-success-800 dark:text-success-300">₱{{ totalDisbursed.toLocaleString() }}</p>
                </UCard>
                <UCard variant="subtle" class="border border-warning-200 dark:border-warning-900 bg-warning-50 dark:bg-warning-950/20">
                    <p class="text-sm text-warning-700 dark:text-warning-400 font-medium mb-1">Pending Amount Pipeline</p>
                    <p class="text-3xl font-bold text-warning-800 dark:text-warning-300">₱{{ pendingAmount.toLocaleString() }}</p>
                </UCard>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <UCard class="ring-0 border border-gray-200 dark:border-gray-800 shadow-none">
                    <template #header>
                        <h3 class="font-semibold">Application Trends</h3>
                    </template>
                    <div class="h-[300px]">
                        <Line :data="timelineData" :options="defaultOptions" />
                    </div>
                </UCard>

                <UCard class="ring-0 border border-gray-200 dark:border-gray-800 shadow-none">
                    <template #header>
                        <h3 class="font-semibold">Application Status Distribution</h3>
                    </template>
                    <div class="h-[300px]">
                        <Doughnut :data="statusData" :options="doughnutOptions" />
                    </div>
                </UCard>
            </div>
        </div>
    </template>
</template>

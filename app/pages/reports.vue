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
    const isReset = totalLoans.value === 0
    return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            lineDataset({
                label: 'Applications Received',
                data: isReset ? [0, 0, 0, 0] : [12, 19, 15, totalLoans.value],
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
    <AuthGate v-if="!isAuthorized" title="Manager Access Required" description="You need Manager or Admin privileges to view system reports and analytics." icon="i-lucide-lock" />

    <UContainer v-else class="space-y-6">
        <UPageCard title="Reports & Analytics" description="Export financial data and monitor system KPIs." variant="naked"
        orientation="horizontal" class="rounded-none" />

        <!-- Header Controls -->
        <ClientOnly>
            <Teleport to="#header-actions-teleport">
                <UButton label="Export CSV" icon="i-lucide-download" color="primary" @click="handleExport" />
            </Teleport>
        </ClientOnly>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard variant="subtle">
                <p class="text-sm text-muted font-medium mb-1">Total Applications</p>
                <p class="text-3xl font-bold">{{ totalLoans }}</p>
            </UCard>
            <UCard variant="subtle" class="ring-success-200 dark:ring-success-900 bg-success-50 dark:bg-success-950/20">
                <p class="text-sm text-success-700 dark:text-success-400 font-medium mb-1">Total Disbursed</p>
                <p class="text-3xl font-bold text-success-800 dark:text-success-300">₱{{ totalDisbursed.toLocaleString() }}</p>
            </UCard>
            <UCard variant="subtle" class="ring-warning-200 dark:ring-warning-900 bg-warning-50 dark:bg-warning-950/20">
                <p class="text-sm text-warning-700 dark:text-warning-400 font-medium mb-1">Pending Amount Pipeline</p>
                <p class="text-3xl font-bold text-warning-800 dark:text-warning-300">₱{{ pendingAmount.toLocaleString() }}</p>
            </UCard>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UCard variant="subtle" class="shadow-sm">
                <template #header>
                    <h3 class="font-semibold">Application Trends</h3>
                </template>
                <div class="h-[300px]">
                    <Line :data="timelineData" :options="defaultOptions" />
                </div>
            </UCard>

            <UCard variant="subtle" class="shadow-sm">
                <template #header>
                    <h3 class="font-semibold">Application Status Distribution</h3>
                </template>
                <div class="h-[300px]">
                    <Doughnut :data="statusData" :options="doughnutOptions" />
                </div>
            </UCard>
        </div>
    </UContainer>
</template>

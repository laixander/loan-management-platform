<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { Line, Bar, Doughnut } from 'vue-chartjs'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Dashboard',
    description: 'Key metrics and loan analytics overview.',
})

// ============================================================================
// Composables
// ============================================================================
const { dashboard, isPending, hasData } = useLoanDashboard()
const { palette, legendLabels, defaultOptions, doughnutOptions, lineDataset, barDataset, doughnutDataset } = useChart()

// ============================================================================
// Computed — Stat Values (default to 0 when empty)
// ============================================================================
const stats = computed(() => dashboard.value?.stats ?? {
    totalActiveLoans: 0,
    pendingApprovals: 0,
    monthlyCollections: 0,
    totalOutstanding: 0,
    totalDisbursed: 0,
    collectionRate: 0
})

// ============================================================================
// Computed — Chart Data (always rendered, uses empty arrays when no data)
// ============================================================================

/**
 * Monthly Disbursements vs Collections — dual-series line chart
 */
const disbursementVsCollectionData = computed(() => {
    const months = dashboard.value?.monthlyDisbursements.map(d => d.month) ?? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const disbursements = dashboard.value?.monthlyDisbursements.map(d => d.amount) ?? [0, 0, 0, 0, 0, 0]
    const collections = dashboard.value?.monthlyCollections.map(d => d.amount) ?? [0, 0, 0, 0, 0, 0]

    return {
        labels: months,
        datasets: [
            lineDataset({
                label: 'Disbursements',
                data: disbursements,
                borderColor: palette.blue.solid,
                backgroundColor: palette.blue.soft
            }),
            lineDataset({
                label: 'Collections',
                data: collections,
                borderColor: palette.green.solid,
                backgroundColor: palette.green.soft
            })
        ]
    }
})

/**
 * Loans by Type — bar chart
 */
const loansByTypeData = computed(() => {
    const types = dashboard.value?.loansByType.map(l => l.type) ?? ['Salary', 'Emergency', 'Calamity', 'Equipment', 'Cash Advance']
    const counts = dashboard.value?.loansByType.map(l => l.count) ?? [0, 0, 0, 0, 0]

    return {
        labels: types,
        datasets: [barDataset({
            label: 'Active Loans',
            data: counts
        })]
    }
})

/**
 * Loans by Status — doughnut chart
 */
const loansByStatusData = computed(() => {
    const statuses = dashboard.value?.loansByStatus.map(l => l.status) ?? ['Active', 'Pending', 'Completed', 'Rejected', 'Defaulted']
    const counts = dashboard.value?.loansByStatus.map(l => l.count) ?? [0, 0, 0, 0, 0]

    return {
        labels: statuses,
        datasets: [doughnutDataset({
            label: 'Loan Status',
            data: counts
        })]
    }
})

/**
 * Multi-series chart options with legend
 */
const multiSeriesOptions = computed(() => ({
    ...defaultOptions,
    plugins: {
        ...defaultOptions.plugins,
        legend: { display: true, labels: legendLabels }
    }
}))

// ============================================================================
// Helpers
// ============================================================================

/**
 * Format currency values
 */
function formatCurrency(value: number): string {
    if (value === 0) return '₱0'
    if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `₱${(value / 1000).toFixed(0)}K`
    return `₱${value.toLocaleString()}`
}

/**
 * Get badge color for application status
 */
function getStatusColor(status: string): string {
    const map: Record<string, string> = {
        Draft: 'neutral',
        Pending: 'warning',
        Approved: 'success',
        Rejected: 'error',
        Disbursed: 'primary'
    }
    return map[status] || 'neutral'
}
</script>

<template>
    <!-- <UPageCard title="Dashboard" description="Key metrics and loan analytics overview." variant="naked"
        orientation="horizontal" class="rounded-none" /> -->

    <!-- ── Stat Cards ──────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Active Loans" :value="stats.totalActiveLoans" icon="i-lucide-file-check"
            :trend="hasData ? '3 new this week' : undefined" trendDirection="up" />
        <StatCard title="Pending Approvals" :value="stats.pendingApprovals" icon="i-lucide-clock"
            :trend="hasData ? '2 urgent' : undefined" trendDirection="up" />
        <StatCard title="Monthly Collections" :value="formatCurrency(stats.monthlyCollections)" icon="i-lucide-banknote"
            :trend="hasData ? '8% from last month' : undefined" trendDirection="up" />
        <StatCard title="Outstanding Balance" :value="formatCurrency(stats.totalOutstanding)" icon="i-lucide-wallet"
            :trend="hasData ? '₱150K reduction' : undefined" trendDirection="down" />
        <StatCard title="Total Disbursed" :value="formatCurrency(stats.totalDisbursed)" icon="i-lucide-trending-up"
            :trend="hasData ? 'Year to date' : undefined" trendDirection="flat" />
        <StatCard title="Collection Rate" :value="`${stats.collectionRate}%`" icon="i-lucide-target"
            :trend="hasData ? '1.2% improvement' : undefined" trendDirection="up" />
    </div>

    <!-- ── Row 1: Line Chart + Doughnut ────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <AppCard 
            title="Disbursements vs Collections"
            description="Monthly financial flow comparison"
            variant="subtle" 
            class="shadow-sm lg:col-span-2"
        >
            <!-- Put the Badge on the right side of the header -->
            <template #after>
                <UBadge variant="soft" color="primary">6 Months</UBadge>
            </template>
            <!-- Card Body Content -->
            <div class="h-[280px] w-full">
                <Line :data="disbursementVsCollectionData" :options="multiSeriesOptions" />
            </div>
        </AppCard>

        <AppCard 
            title="Loan Status"
            description="Distribution by status"
            variant="subtle" 
            class="shadow-sm"
        >
            <template #after>
                <UBadge variant="soft" color="primary">All Time</UBadge>
            </template>
            <div class="h-[280px] w-full">
                <Doughnut :data="loansByStatusData" :options="doughnutOptions" />
            </div>
        </AppCard>
    </div>

    <!-- ── Row 2: Bar Chart + Recent Applications ──────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <AppCard 
            title="Loans by Type"
            description="Active loan distribution"
            variant="subtle" 
            class="shadow-sm"
        >
            <template #after>
                <UBadge variant="soft" color="primary">Current</UBadge>
            </template>
            <div class="h-[280px] w-full">
                <Bar :data="loansByTypeData" :options="defaultOptions" />
            </div>
        </AppCard>

        <AppCard 
            title="Recent Applications"
            description="Latest loan application activity"
            variant="subtle" 
            class="shadow-sm lg:col-span-2"
        >
            <template #after>
                <UBadge variant="soft" color="primary">{{
                    dashboard?.recentApplications?.length ?? 0 }} entries</UBadge>
            </template>

            <!-- Applications Table -->
            <div v-if="dashboard?.recentApplications?.length" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-default">
                            <th
                                class="text-left py-2.5 px-3 text-xs font-semibold text-muted uppercase tracking-wider">
                                Employee</th>
                            <th
                                class="text-left py-2.5 px-3 text-xs font-semibold text-muted uppercase tracking-wider">
                                Type</th>
                            <th
                                class="text-right py-2.5 px-3 text-xs font-semibold text-muted uppercase tracking-wider">
                                Amount</th>
                            <th
                                class="text-center py-2.5 px-3 text-xs font-semibold text-muted uppercase tracking-wider">
                                Status</th>
                            <th
                                class="text-right py-2.5 px-3 text-xs font-semibold text-muted uppercase tracking-wider">
                                Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="app in dashboard.recentApplications" :key="app.id"
                            class="border-b border-default last:border-0 hover:bg-muted/30 transition-colors">
                            <td class="py-2.5 px-3 font-medium">{{ app.employeeName }}</td>
                            <td class="py-2.5 px-3 text-muted">{{ app.loanType }}</td>
                            <td class="py-2.5 px-3 text-right font-mono">₱{{ app.amount.toLocaleString() }}</td>
                            <td class="py-2.5 px-3 text-center">
                                <UBadge :color="(getStatusColor(app.status) as any)" variant="subtle">
                                    {{ app.status }}
                                </UBadge>
                            </td>
                            <td class="py-2.5 px-3 text-right text-muted text-xs">{{ app.date }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty state for table -->
            <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="relative flex items-center justify-center w-16 h-16 rounded-4xl bg-muted/50 mb-4">
                    <UIcon name="i-lucide-file-text" class="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                </div>
                <p class="text-sm font-semibold text-neutral-900 dark:text-white">No applications yet</p>
                <p class="text-xs text-muted mt-1">Applications will appear here once data is deployed.</p>
            </div>
        </AppCard>
    </div>

    <!-- ── Row 3: Loan Type Cards + Top Repayments ─────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <!-- Loan Types Overview -->
        <AppCard 
            title="Loan Type Overview"
            description="Configured loan products"
            variant="subtle" 
            class="shadow-sm"
        >
            <template #after>
                <UBadge variant="soft" color="primary">{{ dashboard?.loanTypes?.length ?? 0 }} types</UBadge>
            </template>

            <div v-if="dashboard?.loanTypes?.length" class="space-y-3">
                <UCard v-for="loanType in dashboard.loanTypes" :key="loanType.id" variant="soft" class="bg-white dark:bg-muted shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div class="flex items-center justify-between">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <h4 class="text-sm font-semibold truncate">{{ loanType.name }}</h4>
                                <UBadge variant="subtle" color="secondary" size="xs">
                                    {{ loanType.activeLoans }} active
                                </UBadge>
                            </div>
                            <div class="flex items-center gap-3 mt-1">
                                <span class="text-xs text-muted">Max: ₱{{ loanType.maxAmount.toLocaleString() }}</span>
                                <span class="text-xs text-muted">{{ loanType.interestRate }}% interest</span>
                            </div>
                        </div>
                        <div class="text-right shrink-0 ml-4">
                            <span class="text-sm font-bold">{{ formatCurrency(loanType.totalDisbursed) }}</span>
                            <span class="text-[10px] text-muted block">disbursed</span>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- Empty state -->
            <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="relative flex items-center justify-center w-16 h-16 rounded-4xl bg-muted/50 mb-4">
                    <UIcon name="i-lucide-landmark" class="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                </div>
                <p class="text-sm font-semibold text-neutral-900 dark:text-white">No loan types configured</p>
                <p class="text-xs text-muted mt-1">Loan products will appear here once data is deployed.</p>
            </div>
        </AppCard>

        <!-- Top Repayments -->
        <AppCard 
            title="Active Repayments"
            description="Outstanding balances and progress"
            variant="subtle" 
            class="shadow-sm"
        >
            <template #after>
                <UBadge variant="soft" color="primary">{{ dashboard?.repayments?.length ?? 0 }} active</UBadge>
            </template>

            <div v-if="dashboard?.repayments?.length" class="space-y-3">
                <UCard v-for="rep in dashboard.repayments" :key="rep.id" variant="soft" class="bg-white dark:bg-muted shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h4 class="text-sm font-semibold">{{ rep.employeeName }}</h4>
                            <span class="text-xs text-muted">{{ rep.loanRef }} · {{ rep.loanType }}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-sm font-bold">₱{{ rep.outstandingBalance.toLocaleString() }}</span>
                            <span class="text-[10px] text-muted block">remaining</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex-1">
                            <UProgress :model-value="rep.progressPercent" size="sm" />
                        </div>
                        <span class="text-xs font-semibold text-primary shrink-0">{{ rep.progressPercent }}%</span>
                    </div>
                    <div class="flex items-center justify-between mt-2 text-xs text-muted">
                        <span>Paid: ₱{{ rep.totalPaid.toLocaleString() }}</span>
                        <span>Next: {{ rep.nextDeduction }}</span>
                    </div>
                </UCard>
            </div>

            <!-- Empty state -->
            <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="relative flex items-center justify-center w-16 h-16 rounded-4xl bg-muted/50 mb-4">
                    <UIcon name="i-lucide-receipt" class="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                </div>
                <p class="text-sm font-semibold text-neutral-900 dark:text-white">No active repayments</p>
                <p class="text-xs text-muted mt-1">Repayment records will appear here once data is deployed.</p>
            </div>
        </AppCard>
    </div>
</template>

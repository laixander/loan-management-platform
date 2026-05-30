<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const loanId = parseInt(route.params.id as string)

const authStore = useAuthStore()
const { myApplications, getMySchedules, getMyLedger, isPending } = useMyLoans()

const isEmployeeMode = computed(() => authStore.currentRole === 'Employee' && authStore.currentEmployeeId !== null)

const loan = computed(() => myApplications.value.find(a => a.id === loanId))
const schedules = computed(() => getMySchedules(loanId))
const ledger = computed(() => getMyLedger(loanId))

// Calculate active metrics
const totalPaid = computed(() => {
    return schedules.value
        .filter(s => s.status === 'Paid')
        .reduce((sum, s) => sum + s.totalAmount, 0)
})

const outstandingBalance = computed(() => {
    // Look at ledger first, if it has entries, grab the latest balance
    if (ledger.value.length > 0) {
        // Find latest based on ID since it's append-only
        const latest = [...ledger.value].sort((a, b) => b.id - a.id)[0]
        return latest!.balanceAfter
    }
    // Fallback to schedule running balance if no ledger entries yet
    if (schedules.value.length > 0) {
        return schedules.value[0]!.runningBalance + schedules.value[0]!.totalAmount
    }
    return loan.value?.approvedAmount || loan.value?.requestedAmount || 0
})

import { h } from 'vue'
import { UBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'

const scheduleColumns: TableColumn<any>[] = [
    { accessorKey: 'installmentNumber', header: '#' },
    { 
        accessorKey: 'dueDate', 
        header: 'Due Date',
        cell: ({ row }) => new Date(row.getValue('dueDate')).toLocaleDateString()
    },
    { 
        accessorKey: 'principalAmount', 
        header: 'Principal',
        cell: ({ row }) => `₱${Number(row.getValue('principalAmount')).toLocaleString()}`
    },
    { 
        accessorKey: 'interestAmount', 
        header: 'Interest',
        cell: ({ row }) => `₱${Number(row.getValue('interestAmount')).toLocaleString()}`
    },
    { 
        accessorKey: 'totalAmount', 
        header: 'Total',
        cell: ({ row }) => `₱${Number(row.getValue('totalAmount')).toLocaleString()}`
    },
    { 
        accessorKey: 'runningBalance', 
        header: 'Balance',
        cell: ({ row }) => `₱${Number(row.getValue('runningBalance')).toLocaleString()}`
    },
    { 
        accessorKey: 'status', 
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h(UBadge, { label: status, color: getStatusColor(status), variant: 'subtle', size: 'sm' })
        }
    }
]

const ledgerColumns: TableColumn<any>[] = [
    { 
        accessorKey: 'transactionDate', 
        header: 'Date',
        cell: ({ row }) => new Date(row.getValue('transactionDate')).toLocaleString()
    },
    { accessorKey: 'transactionType', header: 'Type' },
    { accessorKey: 'description', header: 'Description' },
    { 
        accessorKey: 'amount', 
        header: 'Amount',
        cell: ({ row }) => {
            const type = row.getValue('transactionType') as string
            const amount = Number(row.getValue('amount'))
            const isCredit = ['Repayment', 'Waiver', 'Settlement'].includes(type)
            return h('span', { class: isCredit ? 'text-success-600' : 'text-error-600' }, `₱${amount.toLocaleString()}`)
        }
    },
    { 
        accessorKey: 'balanceAfter', 
        header: 'Balance',
        cell: ({ row }) => `₱${Number(row.getValue('balanceAfter')).toLocaleString()}`
    }
]

const tabs = [
    { label: 'Amortization Schedule', icon: 'i-lucide-calendar', slot: 'schedule' },
    { label: 'Transaction Ledger', icon: 'i-lucide-receipt', slot: 'ledger' }
]

function getStatusColor(status: string) {
    switch (status) {
        case 'Active':
        case 'Paid': return 'success'
        case 'Pending':
        case 'Under Review': return 'warning'
        case 'Approved': return 'primary'
        case 'Disbursed': return 'info'
        case 'Rejected':
        case 'Overdue': return 'error'
        default: return 'neutral'
    }
}
</script>

<template>
    <UContainer>
        <AuthGate v-if="!isEmployeeMode" title="Employee Access Required" description="This self-service dashboard is only available to employees." icon="i-lucide-lock" />

        <div v-else-if="!isPending && !loan" class="flex flex-col items-center justify-center h-full gap-4 text-center">
            <UIcon name="i-lucide-file-x" class="w-16 h-16 text-gray-400" />
            <h2 class="text-2xl font-bold">Loan Not Found</h2>
            <p class="text-gray-500">This loan doesn't exist or you don't have permission to view it.</p>
            <UButton to="/my-loans" color="neutral" variant="soft" label="Back to My Loans" icon="i-lucide-arrow-left" />
        </div>

        <div v-else-if="loan" class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <UButton to="/my-loans" color="neutral" variant="ghost" icon="i-lucide-arrow-left" class="rounded-full" />
                    <div>
                        <div class="flex items-center gap-3">
                            <h1 class="text-2xl font-bold">{{ loan.loanType }}</h1>
                            <UBadge :label="loan.status" :color="getStatusColor(loan.status)" variant="subtle" size="md" />
                        </div>
                        <p class="text-gray-500 text-sm mt-1">{{ loan.loanRef }} • Applied on {{ new Date(loan.applicationDate).toLocaleDateString() }}</p>
                    </div>
                </div>
            </div>

            <!-- Key Metrics Banner -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UCard variant="soft" class="bg-violet-50 dark:bg-violet-900/20">
                    <p class="text-sm text-violet-500 font-medium mb-1">Approved Amount</p>
                    <p class="text-2xl font-bold text-violet-900 dark:text-violet-300">₱{{ (loan.approvedAmount || loan.requestedAmount).toLocaleString() }}</p>
                </UCard>
                <UCard variant="soft" class="bg-primary-50 dark:bg-primary-950/20">
                    <p class="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">Total Paid</p>
                    <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">₱{{ totalPaid.toLocaleString() }}</p>
                </UCard>
                <UCard variant="soft" class="bg-error-50 dark:bg-error-950/20">
                    <p class="text-sm text-error-600 dark:text-error-400 font-medium mb-1">Outstanding Balance</p>
                    <p class="text-2xl font-bold text-error-700 dark:text-error-300">₱{{ outstandingBalance.toLocaleString() }}</p>
                </UCard>
            </div>

            <!-- Tabs -->
            <UTabs :items="tabs" class="mt-8">
                <template #schedule>
                    <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0' }">
                        <div v-if="schedules.length === 0" class="text-center py-16 text-muted">
                            No schedule available yet. (Loan must be disbursed first).
                        </div>
                        <UTable v-else :data="schedules" :columns="scheduleColumns" />
                    </UCard>
                </template>
                
                <template #ledger>
                    <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0' }">
                        <div v-if="ledger.length === 0" class="text-center py-16 text-muted">
                            No transactions recorded yet.
                        </div>
                        <UTable v-else :data="ledger" :columns="ledgerColumns" />
                    </UCard>
                </template>
            </UTabs>
        </div>
    </UContainer>
</template>

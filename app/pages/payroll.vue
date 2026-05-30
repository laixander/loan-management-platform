<script setup lang="ts">
import { computed, h, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { UBadge, UButton, UCard, UTable } from '#components'
import { usePayrollStore } from '~/stores/payroll.store'
import { useLoanStore } from '~/stores/loan.store'
import { useRepaymentStore } from '~/stores/repayment.store'
import { useAppToast } from '~/composables/useAppToast'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Payroll Deductions',
    description: 'Manage and process employee loan deductions per payroll cycle.',
})

// ============================================================================
// State
// ============================================================================
const payrollStore = usePayrollStore()
const loanStore = useLoanStore()
const repaymentStore = useRepaymentStore()
const toast = useAppToast()

// Filter for unique cycles
const availableCycles = computed(() => {
    const cycles = new Set(payrollStore.deductions.map(d => d.payrollCycle))
    return Array.from(cycles).sort().reverse() // Newest first
})

const selectedCycle = ref<string>(availableCycles.value[0] || '')

// Watch for changes in available cycles if it was empty initially
watch(availableCycles, (newVal) => {
    if (!selectedCycle.value && newVal.length > 0) {
        selectedCycle.value = newVal[0]!
    }
})

// Filtered deductions for the selected cycle
const filteredDeductions = computed(() => {
    return payrollStore.deductions.filter(d => d.payrollCycle === selectedCycle.value)
})

const canProcessCycle = computed(() => {
    return filteredDeductions.value.some(d => d.status === 'Scheduled')
})

const totalScheduledAmount = computed(() => {
    return filteredDeductions.value
        .filter(d => d.status === 'Scheduled')
        .reduce((sum, d) => sum + d.deductionAmount, 0)
})

const totalProcessedAmount = computed(() => {
    return filteredDeductions.value
        .filter(d => d.status === 'Processed')
        .reduce((sum, d) => sum + d.deductionAmount, 0)
})

// ============================================================================
// Columns
// ============================================================================
const columns: TableColumn<any>[] = [
    { accessorKey: 'employeeName', header: 'Employee' },
    { accessorKey: 'loanRef', header: 'Loan Ref' },
    { accessorKey: 'installmentNumber', header: 'Inst. #' },
    { 
        accessorKey: 'cutoffDate', 
        header: 'Cutoff Date',
        cell: ({ row }) => new Date(row.getValue('cutoffDate')).toLocaleDateString()
    },
    { 
        accessorKey: 'deductionAmount', 
        header: 'Amount',
        cell: ({ row }) => `₱${Number(row.getValue('deductionAmount')).toLocaleString()}`
    },
    { 
        accessorKey: 'status', 
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const color = status === 'Processed' ? 'success' : status === 'Scheduled' ? 'warning' : 'neutral'
            return h(UBadge, { label: status, color, variant: 'subtle' })
        }
    }
]

// ============================================================================
// Actions
// ============================================================================
function processCycle() {
    // In a real app, this would hit an API. Here we simulate the processing.
    const scheduled = filteredDeductions.value.filter(d => d.status === 'Scheduled')
    
    // Process each deduction
    scheduled.forEach(d => {
        // 1. Mark deduction as processed
        payrollStore.processDeduction(d.id)
        
        // 2. Mark the corresponding repayment schedule as Paid
        const index = loanStore.schedules.findIndex(s => s.id === d.repaymentScheduleId)
        if (index !== -1) {
            const updated = [...loanStore.schedules]
            updated[index] = {
                ...updated[index]!,
                status: 'Paid',
                paidDate: new Date().toISOString()
            }
            loanStore.setSchedules(updated)
        }
        
        // 3. Create a transaction ledger entry for the repayment
        repaymentStore.addTransactions([{
            id: Math.max(0, ...repaymentStore.transactions.map(t => t.id)) + 1,
            loanApplicationId: loanStore.schedules.find(s => s.id === d.repaymentScheduleId)!.loanApplicationId,
            loanRef: d.loanRef,
            transactionType: 'Repayment',
            amount: d.deductionAmount,
            balanceBefore: 0, // In a real app we'd compute this
            balanceAfter: 0,
            description: `Payroll Deduction for ${d.payrollCycle}`,
            transactionDate: new Date().toISOString()
        }])
    })

    toast.success('Cycle Processed', `Successfully processed ₱${totalScheduledAmount.value.toLocaleString()} in deductions.`)
}

const authStore = useAuthStore()
const isAuthorized = computed(() => ['HR', 'Finance', 'Admin'].includes(authStore.currentRole ?? ''))

</script>

<template>
    <AuthGate v-if="!isAuthorized" title="Authorized Personnel Only" description="You need HR, Finance, or Admin privileges to view payroll deductions." icon="i-lucide-lock" />

    <UContainer v-else class="space-y-6">
        <UPageCard title="Payroll" description="Manually process payroll deductions for the current cycle." variant="naked"
            orientation="horizontal" class="rounded-none" />
        
        <!-- Header Controls -->
        <ClientOnly>
            <Teleport to="#header-actions-teleport">
                <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Select Payroll Cycle:</span>
                    <USelect v-model="selectedCycle" :items="availableCycles" class="w-48" />
                </div>
                
                <UButton 
                    v-if="canProcessCycle"
                    label="Process Deductions" 
                    icon="i-lucide-play-circle" 
                    color="primary" 
                    @click="processCycle" 
                />
            </Teleport>
        </ClientOnly>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard variant="subtle" class="ring-warning-200 dark:ring-warning-900 bg-warning-50 dark:bg-warning-950/20">
                <p class="text-sm text-warning-700 dark:text-warning-400 font-medium mb-1">Scheduled for Deduction</p>
                <p class="text-2xl font-bold text-warning-800 dark:text-warning-300">₱{{ totalScheduledAmount.toLocaleString() }}</p>
            </UCard>
            <UCard variant="subtle" class="ring-success-200 dark:ring-success-900 bg-success-50 dark:bg-success-950/20">
                <p class="text-sm text-success-700 dark:text-success-400 font-medium mb-1">Processed</p>
                <p class="text-2xl font-bold text-success-800 dark:text-success-300">₱{{ totalProcessedAmount.toLocaleString() }}</p>
            </UCard>
        </div>

        <!-- Data Table -->
        <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0' }">
            <div v-if="filteredDeductions.length === 0" class="text-center py-16 text-muted">
                <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto mb-3" />
                No deductions found for this cycle.
            </div>
            <UTable v-else :data="filteredDeductions" :columns="columns" />
        </UCard>
    </UContainer>
</template>

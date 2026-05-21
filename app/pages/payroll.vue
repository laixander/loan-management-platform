<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { h, ref, useTemplateRef, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { UBadge, UButton, UDropdownMenu } from '#components'

// Types
import type { PayrollDeduction, DeductionStatus } from '~/types'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Payroll Deductions',
    isTable: true,
    headerActions: [
        { label: 'History', icon: 'i-lucide-history', event: 'viewLogs', variant: 'soft' }
    ]
})

// ============================================================================
// Composables & State
// ============================================================================
const { deductions, updateStatus, batchProcessCycle, isPending: pending } = usePayroll()
const { currentRole } = useDemoAuth()
const events = useEvents()

// Local State
const isDrawerOpen = ref(false)

// Selectable Payroll Cycles (mocked from available data)
const cycles = computed(() => {
    const unique = new Set(deductions.value.map(d => d.payrollCycle))
    return Array.from(unique).sort()
})
const selectedCycle = ref(cycles.value[0] || '2026-05-B')

// We watch cycles and ensure selectedCycle is valid
watch(cycles, (newCycles) => {
    if (!newCycles.includes(selectedCycle.value) && newCycles.length > 0) {
        selectedCycle.value = newCycles[0]!
    }
})

const isAuthorized = computed(() => ['Payroll', 'Admin'].includes(currentRole.value))

// Filter deductions by selected cycle
const filteredDeductions = computed(() => {
    return deductions.value.filter(d => d.payrollCycle === selectedCycle.value)
})

const canRunPayroll = computed(() => {
    return isAuthorized.value && filteredDeductions.value.some(d => d.status === 'Scheduled')
})

// ============================================================================
// Event Listeners
// ============================================================================
events.on('viewLogs', () => {
    isDrawerOpen.value = true
})

// ============================================================================
// Methods
// ============================================================================

function getStatusColor(status: DeductionStatus) {
    switch (status) {
        case 'Scheduled': return 'primary'
        case 'Processed': return 'success'
        case 'On-Hold': return 'warning'
        case 'Cancelled': return 'error'
        default: return 'neutral'
    }
}

async function handleRunPayroll() {
    if (!isAuthorized.value) return
    await batchProcessCycle(selectedCycle.value)
}

function handleStatusUpdate(id: number, status: DeductionStatus) {
    if (!isAuthorized.value) return
    updateStatus(id, status)
}

// ============================================================================
// Table Configuration
// ============================================================================
const columns: TableColumn<PayrollDeduction>[] = [
    {
        accessorKey: 'employeeName',
        header: getSortableHeader('Employee'),
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'font-medium' }, row.getValue('employeeName')),
            h('span', { class: 'text-xs text-muted' }, row.original.loanRef)
        ])
    },
    {
        accessorKey: 'installmentNumber',
        header: getSortableHeader('Installment #'),
        cell: ({ row }) => `${row.getValue('installmentNumber')}`
    },
    {
        accessorKey: 'cutoffDate',
        header: getSortableHeader('Cutoff Date'),
        cell: ({ row }) => {
            const val = row.getValue('cutoffDate') as string
            return new Date(val).toLocaleDateString()
        }
    },
    {
        accessorKey: 'deductionAmount',
        header: getSortableHeader('Amount (₱)'),
        meta: { class: { td: 'text-right', th: 'text-right' } },
        cell: ({ row }) => {
            const val = row.getValue('deductionAmount') as number
            return h('span', { class: 'font-medium' }, `₱${val.toLocaleString()}`)
        }
    },
    {
        accessorKey: 'status',
        header: getSortableHeader('Status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as DeductionStatus
            return h(UBadge, {
                label: status,
                color: getStatusColor(status),
                variant: 'subtle'
            })
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const status = row.original.status
            if (!isAuthorized.value || status === 'Processed') return h('div') // No actions
            
            return h('div', { class: 'flex gap-2 justify-end' }, [
                status !== 'On-Hold' 
                    ? h(UButton, { label: 'Hold', color: 'warning', variant: 'soft', size: 'xs', onClick: () => handleStatusUpdate(row.original.id, 'On-Hold') })
                    : h(UButton, { label: 'Resume', color: 'primary', variant: 'soft', size: 'xs', onClick: () => handleStatusUpdate(row.original.id, 'Scheduled') }),
                h(UButton, { label: 'Process', color: 'success', variant: 'soft', size: 'xs', onClick: () => handleStatusUpdate(row.original.id, 'Processed') })
            ])
        }
    }
]

const table = useTemplateRef('table')
const globalFilter = ref('')
const columnVisibility = ref({})
</script>

<template>
    <div v-if="!isAuthorized" class="flex flex-col items-center justify-center h-full flex-1 gap-4 text-center p-6">
        <UIcon name="i-lucide-shield-alert" class="w-16 h-16 text-warning" />
        <h2 class="text-2xl font-bold">Payroll / Admin Access Required</h2>
    </div>

    <div v-else class="flex flex-col flex-1 h-full w-full">
        <UPageCard title="Payroll Deductions"
            description="Manage automated loan deductions synced with the payroll system."
            variant="naked" orientation="horizontal" class="border-b border-default rounded-none p-4 sm:p-6">
            
            <div class="flex justify-end gap-3 flex-1 items-center flex-wrap">
                <div class="flex items-center gap-2 mr-2">
                    <span class="text-sm font-medium text-muted">Cycle:</span>
                    <USelect v-model="selectedCycle" :items="cycles" class="w-32" />
                </div>

                <TableGlobalFilter v-model="globalFilter" />
                <TableColumnToggle :table="table" />
                
                <!-- Batch Action -->
                <UButton 
                    label="Run Payroll" 
                    icon="i-lucide-play-circle" 
                    color="primary" 
                    :disabled="!canRunPayroll || pending"
                    :loading="pending"
                    @click="handleRunPayroll" 
                />
            </div>
        </UPageCard>

        <UTable sticky ref="table" :data="filteredDeductions" :columns="columns" :loading="pending"
            v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" :ui="{ th: 'sm:px-6', td: 'sm:px-6' }" class="flex-1 scrollbar">
            <template #empty>
                <Empty :loading="pending" title="No Deductions Found"
                    description="No deductions scheduled for this payroll cycle."
                    icon="i-lucide-wallet" loading-title="Loading Deductions"
                    loading-description="Please wait while we sync the payroll data.">
                </Empty>
            </template>
        </UTable>

        <LogsDrawer v-model:open="isDrawerOpen" namespace="payroll" />
    </div>
</template>

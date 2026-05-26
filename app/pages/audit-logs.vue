<script setup lang="ts">
import { h, ref, useTemplateRef, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { UBadge } from '#components'
import type { AppLog } from '~/types'
import { useLogger } from '~/composables/useLogger'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Audit Logs',
    description: 'System-wide activity ledger for tracking all critical mutations.',
    isTable: true
})

// ============================================================================
// Composables & State
// ============================================================================
const authStore = useAuthStore()

const isAuthorized = computed(() => ['Admin', 'HR'].includes(authStore.currentRole ?? ''))

// Initialize loggers to get their reactive state
const loggers = [
    useLogger('loan-applications'),
    useLogger('repayments'),
    useLogger('approvals'),
    useLogger('loan-types'),
    useLogger('payroll'),
    useLogger('schedules'),
    useLogger('users')
]

// Aggregate and sort all logs across all namespaces
const allLogs = computed(() => {
    const combined = loggers.flatMap(logger => logger.logs.value)
    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// ============================================================================
// Table Configuration
// ============================================================================
const columns: TableColumn<AppLog>[] = [
    {
        accessorKey: 'timestamp',
        header: getSortableHeader('Timestamp'),
        cell: ({ row }) => {
            const date = new Date(row.getValue('timestamp') as string)
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm' }, date.toLocaleDateString()),
                h('span', { class: 'text-xs text-muted' }, date.toLocaleTimeString())
            ])
        }
    },
    {
        accessorKey: 'level',
        header: getSortableHeader('Level'),
        cell: ({ row }) => {
            const level = row.getValue('level') as string
            let color = 'neutral' as 'neutral' | 'success' | 'warning' | 'error' | 'primary'
            if (level === 'success') color = 'success'
            else if (level === 'warn') color = 'warning'
            else if (level === 'error') color = 'error'
            else if (level === 'info') color = 'primary'
            
            return h(UBadge, { label: level.toUpperCase(), color, variant: 'subtle', size: 'sm' })
        }
    },
    {
        accessorKey: 'state',
        header: getSortableHeader('Action Category'),
        cell: ({ row }) => h('code', { class: 'text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded' }, row.getValue('state') as string)
    },
    {
        accessorKey: 'message',
        header: getSortableHeader('Event Description'),
        cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('message') as string)
    }
]

const table = useTemplateRef('table')
const globalFilter = ref('')
const columnVisibility = ref({})
</script>

<template>
    <div v-if="!isAuthorized" class="flex flex-col items-center justify-center h-full flex-1 gap-4 text-center p-6">
        <UIcon name="i-lucide-shield-alert" class="w-16 h-16 text-warning" />
        <h2 class="text-2xl font-bold">Admin Access Required</h2>
        <p class="text-muted">You do not have permission to view the global audit ledger.</p>
    </div>

    <template v-else>
        <UPageCard title="Global Audit Ledger"
            description="View every system action, status change, and critical event chronologically."
            variant="naked" orientation="horizontal" class="border-b border-default rounded-none p-4 sm:p-6">
            <div class="flex justify-end gap-2 flex-1">
                <TableGlobalFilter v-model="globalFilter" />
                <TableColumnToggle :table="table" />
            </div>
        </UPageCard>

        <UTable sticky ref="table" :data="allLogs" :columns="columns" 
            v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" :ui="{ th: 'sm:px-6', td: 'sm:px-6' }" class="flex-1 scrollbar">
            <template #empty>
                <Empty title="No Audit Logs"
                    description="No system activity has been recorded yet."
                    icon="i-lucide-activity">
                </Empty>
            </template>
        </UTable>
    </template>
</template>

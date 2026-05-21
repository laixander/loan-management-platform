<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { h, ref, useTemplateRef } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useOverlay } from '#imports'
import { UBadge, UButton } from '#components'

// Types
import type { LoanTransaction } from '~/types'

// Components
import RepaymentModal from '~/components/RepaymentModal.vue'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Repayment Tracker',
    isTable: true,
    headerActions: [
        { label: 'History', icon: 'i-lucide-history', event: 'viewLogs', variant: 'soft' },
        { label: 'Record Transaction', icon: 'i-lucide-plus', event: 'addTransaction', color: 'primary' }
    ]
})

// ============================================================================
// Composables & State
// ============================================================================
const { transactions, recordTransaction, isPending: pending } = useRepayments()
const { applications } = useLoanApplications()
const events = useEvents()
const overlay = useOverlay()
const logger = useLogger('repayments')

// Modals
const formModal = overlay.create(RepaymentModal)

// Local State
const isAddModalOpen = ref(false)
const isDrawerOpen = ref(false)

// ============================================================================
// Event Listeners
// ============================================================================
events.on('addTransaction', () => {
    isAddModalOpen.value = true
})
events.on('viewLogs', () => {
    isDrawerOpen.value = true
})

// ============================================================================
// Methods
// ============================================================================

function handleAddTransaction(form: any) {
    const app = applications.value.find(a => a.id === form.loanApplicationId)
    if (app) {
        recordTransaction(app, form.transactionType, form.amount, form.description)
    }
}

// ============================================================================
// Table Configuration
// ============================================================================

function getTypeColor(type: string) {
    switch (type) {
        case 'Disbursement': return 'primary'
        case 'Repayment': return 'success'
        case 'Penalty': return 'error'
        case 'Adjustment': return 'warning'
        case 'Waiver': return 'neutral'
        case 'Settlement': return 'success'
        default: return 'neutral'
    }
}

const columns: TableColumn<LoanTransaction>[] = [
    {
        accessorKey: 'transactionDate',
        header: getSortableHeader('Date'),
        cell: ({ row }) => {
            const val = row.getValue('transactionDate') as string
            return new Date(val).toLocaleDateString()
        }
    },
    {
        accessorKey: 'loanRef',
        header: getSortableHeader('Reference'),
        cell: ({ row }) => `${row.getValue('loanRef')}`
    },
    {
        accessorKey: 'transactionType',
        header: getSortableHeader('Type'),
        cell: ({ row }) => {
            const type = row.getValue('transactionType') as string
            return h(UBadge, {
                label: type,
                color: getTypeColor(type),
                variant: 'subtle'
            })
        }
    },
    {
        accessorKey: 'description',
        header: getSortableHeader('Description'),
        cell: ({ row }) => {
            const val = row.getValue('description') as string | null
            return val ? val : h('span', { class: 'text-muted italic' }, 'No remarks')
        }
    },
    {
        accessorKey: 'amount',
        header: getSortableHeader('Amount (₱)'),
        meta: { class: { td: 'text-right', th: 'text-right' } },
        cell: ({ row }) => {
            const val = row.getValue('amount') as number
            const type = row.getValue('transactionType') as string
            const isDeduction = ['Repayment', 'Waiver', 'Settlement'].includes(type)
            const prefix = isDeduction ? '-' : '+'
            const colorClass = isDeduction ? 'text-success font-medium' : 'text-error font-medium'
            return h('span', { class: colorClass }, `${prefix}₱${val.toLocaleString()}`)
        }
    },
    {
        accessorKey: 'balanceAfter',
        header: getSortableHeader('Balance (₱)'),
        meta: { class: { td: 'text-right font-medium', th: 'text-right' } },
        cell: ({ row }) => {
            const val = row.getValue('balanceAfter') as number
            return `₱${val.toLocaleString()}`
        }
    }
]

const table = useTemplateRef('table')
const globalFilter = ref('')
const columnVisibility = ref({})
</script>

<template>
    <UPageCard title="Repayment Tracker (Ledger)"
        description="Monitor all financial transactions across active loan applications. This is an append-only ledger for data integrity."
        variant="naked" orientation="horizontal" class="border-b border-default rounded-none p-4 sm:p-6">
        <div class="flex justify-end gap-2 flex-1">
            <TableGlobalFilter v-model="globalFilter" />
            <TableColumnToggle :table="table" />
        </div>
    </UPageCard>

    <UTable sticky ref="table" :data="transactions" :columns="columns" :loading="pending"
        v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" :ui="{ th: 'sm:px-6', td: 'sm:px-6' }" class="flex-1 scrollbar">
        <template #empty>
            <Empty :loading="pending" title="No Transactions"
                description="There are currently no ledger entries or repayments recorded."
                icon="i-lucide-activity" loading-title="Loading Ledger"
                loading-description="Please wait while we sync the transaction history.">
                <template #action>
                    <UButton label="Record Transaction" icon="i-lucide-plus" color="primary" size="lg"
                        @click="events.emit('addTransaction')" />
                </template>
            </Empty>
        </template>
    </UTable>

    <RepaymentModal v-model:open="isAddModalOpen" @submit="handleAddTransaction" />

    <LogsDrawer v-model:open="isDrawerOpen" namespace="repayments" />
</template>

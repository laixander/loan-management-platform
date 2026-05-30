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
    description: 'Monitor all financial transactions across active loan applications. This is an append-only ledger for data integrity.',
    isTable: true,
    // headerActions: [
    //     { label: 'Activity Logs', icon: 'i-lucide-scroll-text', event: 'viewLogs', variant: 'ghost' },
    //     { label: 'Record Transaction', icon: 'i-lucide-plus', event: 'addTransaction', color: 'primary' }
    // ]
})

// ============================================================================
// Composables & State
// ============================================================================
const repaymentStore = useRepaymentStore()
const loanStore = useLoanStore()
const authStore = useAuthStore()
const events = useEvents()
const overlay = useOverlay()

// Modals
const formModal = overlay.create(RepaymentModal)

// Local State
const isAddModalOpen = ref(false)
const isDrawerOpen = ref(false)
const pending = ref(false)

const isAuthorized = computed(() => ['Finance', 'Admin'].includes(authStore.currentRole ?? ''))

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

async function handleAddTransaction(form: any) {
    const app = loanStore.applications.find(a => a.id === form.loanApplicationId)
    if (app) {
        pending.value = true
        await RepaymentService.recordTransaction(app, form.transactionType, form.amount, form.description)
        pending.value = false
    }
}

// ============================================================================
// Table Configuration
// ============================================================================

function getTypeColor(type: string) {
    switch (type) {
        case 'Disbursement': return 'primary'
        case 'Repayment': return 'cyan'
        case 'Penalty': return 'error'
        case 'Adjustment': return 'warning'
        case 'Waiver': return 'neutral'
        case 'Settlement': return 'info'
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

const viewMode = ref<'list' | 'card'>('list')
</script>

<template>
    <AuthGate v-if="!isAuthorized" title="Finance / Admin Access Required" description="You need Finance or Admin privileges to process loan repayments." icon="i-lucide-lock" />

    <template v-else>
        <UPageCard title="Repayment Tracker (Ledger)"
        description="Monitor all financial transactions across active loan applications. This is an append-only ledger for data integrity."
        variant="naked" orientation="horizontal" class="border-b border-default rounded-none p-4 sm:p-6">
            <div class="flex flex-1 justify-end items-center gap-2">
                <template v-if="viewMode === 'list'">
                    <TableGlobalFilter v-model="globalFilter" />
                    <TableColumnToggle :table="table" />
                </template>
                <UTabs :items="[{ icon: 'i-lucide-grid-3x3', value: 'card' }, { icon: 'i-lucide-list', value: 'list' }]"
                v-model="viewMode" :content="false" size="xs" />
            </div>
        </UPageCard>

        <ClientOnly>
            <Teleport to="#header-actions-teleport">
                <UButton label="Activity Logs" icon="i-lucide-activity" variant="ghost" color="neutral" @click="isDrawerOpen = true" />
                <UButton label="Record Transaction" icon="i-lucide-plus" @click="events.emit('addTransaction')" />
            </Teleport>
        </ClientOnly>

        <UTable v-if="viewMode === 'list'" sticky ref="table" :data="repaymentStore.transactions" :columns="columns" :loading="pending"
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

        <div v-else class="flex-1 overflow-y-auto scrollbar p-4 sm:p-6">
            <Empty v-if="repaymentStore.transactions.length === 0" :loading="pending" title="No Transactions"
                description="There are currently no ledger entries or repayments recorded."
                icon="i-lucide-activity" loading-title="Loading Ledger"
                loading-description="Please wait while we sync the transaction history.">
                <template #action>
                    <UButton label="Record Transaction" icon="i-lucide-plus" color="primary" size="lg"
                        @click="events.emit('addTransaction')" />
                </template>
            </Empty>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <UCard v-for="tx in repaymentStore.transactions" :key="tx.id" variant="subtle"
                    class="hover:ring-2 hover:ring-primary transition-all duration-200 shadow-sm flex flex-col h-full">
                    <template #header>
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="text-lg font-bold font-mono">{{ tx.loanRef }}</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ tx.description || 'No remarks' }}</p>
                            </div>
                        </div>
                    </template>
                    <div class="flex flex-col flex-1 h-full justify-end">
                        <div class="*:py-2 *:first:pt-0 *:last:pb-0 *:flex *:items-center *:justify-between text-sm divide-y divide-default mt-auto">
                            <div>
                                <span class="text-muted">Transaction Type</span>
                                <UBadge :label="tx.transactionType" :color="getTypeColor(tx.transactionType)" variant="subtle" size="sm" />
                            </div>
                            <div>
                                <span class="text-muted">Amount</span>
                                <span class="font-semibold" :class="['Repayment', 'Waiver', 'Settlement'].includes(tx.transactionType) ? 'text-success' : 'text-error'">
                                    {{ ['Repayment', 'Waiver', 'Settlement'].includes(tx.transactionType) ? '-' : '+' }}₱{{ tx.amount.toLocaleString() }}
                                </span>
                            </div>
                            <div>
                                <span class="text-muted">Balance After</span>
                                <span class="font-semibold">₱{{ tx.balanceAfter.toLocaleString() }}</span>
                            </div>
                            <div>
                                <span class="text-muted">Transaction Date</span>
                                <span class="font-semibold">{{ new Date(tx.transactionDate).toLocaleDateString() }}</span>
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>

        <RepaymentModal v-model:open="isAddModalOpen" @submit="handleAddTransaction" />

        <LogsDrawer v-model:open="isDrawerOpen" namespace="repayments" />
    </template>
</template>

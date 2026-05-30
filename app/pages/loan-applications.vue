<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { h, ref, useTemplateRef } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { useOverlay } from '#imports'
import { UButton, UBadge, UDropdownMenu } from '#components'

// Types
import type { LoanApplication } from '~/types'

// Components
import LoanApplicationModal from '~/components/LoanApplicationModal.vue'
import ConfirmationModal from '~/components/ConfirmationModal.vue'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Loan Applications',
    isTable: true,
    // headerActions: [
    //     { label: 'Activity Logs', icon: 'i-lucide-scroll-text', event: 'viewLogs', variant: 'ghost' },
    //     { label: 'New Application', icon: 'i-lucide-plus', event: 'addApplication', color: 'primary' }
    // ]
})

// ============================================================================
// Composables & State
// ============================================================================
const loanStore = useLoanStore()
const authStore = useAuthStore()
const events = useEvents()
const overlay = useOverlay()

// Modals
const formModal = overlay.create(LoanApplicationModal)
const confirmModal = overlay.create(ConfirmationModal)

// Local State
const isAddModalOpen = ref(false)
const isDrawerOpen = ref(false)
const pending = ref(false)

const isAuthorized = computed(() => ['Supervisor', 'HR', 'Finance', 'Admin'].includes(authStore.currentRole ?? ''))

// ============================================================================
// Event Listeners
// ============================================================================
events.on('addApplication', () => {
    isAddModalOpen.value = true
})
events.on('viewLogs', () => {
    isDrawerOpen.value = true
})

// ============================================================================
// Methods
// ============================================================================

async function handleAddApplication(form: any) {
    pending.value = true
    await LoanService.applyForLoan(form)
    pending.value = false
}

function handleEditApplication(application: LoanApplication) {
    formModal.open({
        application,
        title: 'Edit Application',
        onSubmit: async (form: any) => {
            confirmModal.open({
                title: 'Confirm Changes',
                description: `Are you sure you want to save changes to ${application.loanRef}?`,
                confirmLabel: 'Save Changes',
                confirmColor: 'warning',
                onConfirm: async () => {
                    pending.value = true
                    await LoanService.updateApplication(application.id, form)
                    pending.value = false
                }
            })
        }
    })
}

async function handleDelete(app: LoanApplication) {
    try {
        await confirmModal.open({
            title: 'Delete Application',
            description: `Are you sure you want to delete ${app.loanRef}? This action cannot be undone.`,
            confirmLabel: 'Delete Application',
            confirmColor: 'error'
        })
        pending.value = true
        await LoanService.deleteApplication(app.id)
        pending.value = false
    } catch {
        // User cancelled
    }
}

function handleStatusChange(application: LoanApplication, newStatus: string) {
    confirmModal.open({
        title: `Mark as ${newStatus}`,
        description: `Are you sure you want to change the status of ${application.loanRef} to ${newStatus}?`,
        confirmLabel: 'Confirm',
        confirmColor: newStatus === 'Rejected' ? 'error' : 'primary',
        onConfirm: async () => {
            pending.value = true
            await LoanService.updateApplication(application.id, { status: newStatus as any })
            pending.value = false
        }
    })
}

// ============================================================================
// Table Configuration
// ============================================================================

function getStatusColor(status: string) {
    switch (status) {
        case 'Approved': return 'success'
        case 'Rejected': return 'error'
        case 'Pending': return 'warning'
        case 'Disbursed': return 'primary'
        case 'Active': return 'secondary'
        case 'Draft': return 'neutral'
        case 'Defaulted': return 'error'
        default: return 'neutral'
    }
}

function getCardActions(app: LoanApplication): DropdownMenuItem[][] {
    const status = app.status
    
    const actionGroup: DropdownMenuItem[] = [
        {
            label: 'Edit',
            icon: 'i-lucide-edit',
            onSelect: () => handleEditApplication(app)
        }
    ]

    // Quick actions based on status
    if (status === 'Pending') {
        actionGroup.push({
            label: 'Mark Under Review',
            icon: 'i-lucide-eye',
            onSelect: () => handleStatusChange(app, 'Under Review')
        })
    }
    if (status === 'Under Review' || status === 'Pending') {
        actionGroup.push({
            label: 'Approve',
            icon: 'i-lucide-check-circle',
            onSelect: () => handleStatusChange(app, 'Approved')
        })
        actionGroup.push({
            label: 'Reject',
            icon: 'i-lucide-x-circle',
            onSelect: () => handleStatusChange(app, 'Rejected')
        })
    }
    if (status === 'Approved') {
        actionGroup.push({
            label: 'Disburse Funds',
            icon: 'i-lucide-banknote',
            onSelect: () => handleStatusChange(app, 'Disbursed')
        })
    }

    return [
        actionGroup,
        [
            {
                label: 'Delete',
                icon: 'i-lucide-trash',
                color: 'error',
                onSelect: () => handleDelete(app)
            }
        ]
    ]
}

const columns: TableColumn<LoanApplication>[] = [
    {
        accessorKey: 'loanRef',
        header: getSortableHeader('Reference'),
        cell: ({ row }) => `${row.getValue('loanRef')}`,
    },
    {
        accessorKey: 'employeeName',
        header: getSortableHeader('Employee'),
        cell: ({ row }) => `${row.getValue('employeeName')}`,
    },
    {
        accessorKey: 'loanType',
        header: getSortableHeader('Type'),
        cell: ({ row }) => `${row.getValue('loanType')}`,
    },
    {
        accessorKey: 'requestedAmount',
        header: getSortableHeader('Amount'),
        cell: ({ row }) => {
            const val = row.getValue('requestedAmount') as number
            return `₱${val.toLocaleString()}`
        }
    },
    {
        accessorKey: 'termMonths',
        header: getSortableHeader('Term'),
        cell: ({ row }) => `${row.getValue('termMonths')} mos`
    },
    {
        accessorKey: 'applicationDate',
        header: getSortableHeader('Date'),
        cell: ({ row }) => {
            const val = row.getValue('applicationDate') as string
            return new Date(val).toLocaleDateString()
        }
    },
    {
        accessorKey: 'status',
        header: getSortableHeader('Status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h(UBadge, {
                label: status,
                color: getStatusColor(status),
                variant: 'subtle'
            })
        }
    },
    {
        id: 'actions',
        meta: {
            class: {
                td: 'text-right'
            }
        },
        cell: ({ row }) => {
            return h(UDropdownMenu, {
                items: getCardActions(row.original),
                content: { align: 'end' },
                size: 'sm'
            }, {
                default: () => h(UButton, {
                    icon: 'i-lucide-ellipsis-vertical',
                    color: 'neutral',
                    variant: 'ghost',
                    size: 'sm'
                })
            })
        }
    }
]

const table = useTemplateRef('table')
const globalFilter = ref('')
const columnVisibility = ref({})

const viewMode = ref<'list' | 'card'>('list')
</script>

<template>
    <AuthGate v-if="!isAuthorized" title="Loan Officer / Admin Access Required" description="You need Loan Officer or Admin privileges to review and process applications." icon="i-lucide-lock" />

    <template v-else>
        <UPageCard title="Loan Applications"
        description="View and process all loan requests from employees across the organization."
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
                <UButton label="New Application" icon="i-lucide-plus" @click="events.emit('addApplication')" />
            </Teleport>
        </ClientOnly>

        <UTable v-if="viewMode === 'list'" sticky ref="table" :data="loanStore.applications" :columns="columns" :loading="pending"
            v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" :ui="{ th: 'sm:px-6', td: 'sm:px-6' }" class="flex-1 scrollbar">
            <template #empty>
                <Empty :loading="pending" title="No Applications"
                    description="There are currently no loan applications in the system."
                    icon="i-lucide-file-text" loading-title="Loading Applications"
                    loading-description="Please wait while we fetch the latest records.">
                    <template #action>
                        <UButton label="New Application" icon="i-lucide-plus" color="primary" size="lg"
                            @click="events.emit('addApplication')" />
                    </template>
                </Empty>
            </template>
        </UTable>

        <div v-else class="flex-1 overflow-y-auto scrollbar p-4 sm:p-6">
            <Empty v-if="loanStore.applications.length === 0" :loading="pending" title="No Applications"
                description="There are currently no loan applications in the system."
                icon="i-lucide-file-text" loading-title="Loading Applications"
                loading-description="Please wait while we fetch the latest records.">
                <template #action>
                    <UButton label="New Application" icon="i-lucide-plus" color="primary" size="lg"
                        @click="events.emit('addApplication')" />
                </template>
            </Empty>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <UCard v-for="app in loanStore.applications" :key="app.id" variant="subtle"
                    class="hover:ring-2 hover:ring-primary transition-all duration-200 shadow-sm flex flex-col h-full">
                    <template #header>
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ app.loanRef }}</p>
                                <h3 class="text-lg font-bold">{{ app.employeeName }}</h3>
                            </div>
                            <UDropdownMenu :items="getCardActions(app)" :content="{ align: 'end' }" size="sm">
                                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" />
                            </UDropdownMenu>
                        </div>
                    </template>
                    <div class="*:py-2 *:first:pt-0 *:last:pb-0 *:flex *:items-center *:justify-between text-sm divide-y divide-default">
                        <div>
                            <span class="text-muted">Loan Type</span>
                            <span class="font-medium">{{ app.loanType }}</span>
                        </div>
                        <div>
                            <span class="text-muted">Status</span>
                            <UBadge :label="app.status" :color="getStatusColor(app.status)" variant="subtle" size="sm" />
                        </div>
                        <div>
                            <span class="text-muted">Amount</span>
                            <span class="font-semibold">₱{{ app.requestedAmount.toLocaleString() }}</span>
                        </div>
                        <div>
                            <span class="text-muted">Term</span>
                            <span class="font-semibold">{{ app.termMonths }} mos</span>
                        </div>
                        <div>
                            <span class="text-muted">Date</span>
                            <span class="font-semibold">{{ new Date(app.applicationDate).toLocaleDateString() }}</span>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>

        <LoanApplicationModal v-model:open="isAddModalOpen" @submit="handleAddApplication" />

        <LogsDrawer v-model:open="isDrawerOpen" namespace="loan-applications" />
    </template>
</template>

<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { h, ref, useTemplateRef } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { useOverlay } from '#imports'
import { UButton, UBadge, UDropdownMenu } from '#components'

// Types
import type { LoanType } from '~/types'

// Components
import LoanTypeModal from '~/components/LoanTypeModal.vue'
import ConfirmationModal from '~/components/ConfirmationModal.vue'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Loan Types',
    description: 'Manage the different types of loans available to employees, including their terms and limits.',
    isTable: true,
    headerActions: [
        { label: 'Activity Logs', icon: 'i-lucide-clipboard-list', event: 'viewLogs', variant: 'ghost' },
        { label: 'Add Loan Type', icon: 'i-lucide-plus', event: 'addLoanType', color: 'primary' }
    ]
})

// ============================================================================
// Composables & State
// ============================================================================
// Services
const { loanTypes, addLoanType, updateLoanType, deleteLoanType, isPending: pending } = useLoanTypes()
const events = useEvents()
const overlay = useOverlay()

// Modals
const formModal = overlay.create(LoanTypeModal)
const confirmModal = overlay.create(ConfirmationModal)

// Local State
const isAddModalOpen = ref(false)
const isDrawerOpen = ref(false)

// ============================================================================
// Event Listeners
// ============================================================================
events.on('addLoanType', () => {
    isAddModalOpen.value = true
})
events.on('viewLogs', () => {
    isDrawerOpen.value = true
})

// ============================================================================
// Methods
// ============================================================================

function handleAddLoanType(form: any) {
    addLoanType(form)
    isAddModalOpen.value = false
}

function handleEditLoanType(loanType: LoanType) {
    formModal.open({
        loanType,
        title: 'Edit Loan Type',
        onSubmit: async (form: any) => {
            confirmModal.open({
                title: 'Confirm Changes',
                description: `Are you sure you want to save changes to ${form.name}?`,
                confirmLabel: 'Save Changes',
                confirmColor: 'warning',
                onConfirm: () => {
                    updateLoanType(loanType.id, form)
                }
            })
        }
    })
}

function handleDeleteLoanType(loanType: LoanType) {
    confirmModal.open({
        title: 'Delete Loan Type',
        description: `Are you sure you want to delete the ${loanType.name} offering? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'error',
        onConfirm: () => {
            deleteLoanType(loanType.id)
        }
    })
}

function handleToggleStatus(loanType: LoanType) {
    const isActivating = !loanType.isActive

    confirmModal.open({
        title: `${isActivating ? 'Activate' : 'Deactivate'} Loan Type`,
        description: `Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} ${loanType.name}?`,
        confirmLabel: isActivating ? 'Activate' : 'Deactivate',
        confirmColor: isActivating ? 'success' : 'warning',
        onConfirm: () => {
            updateLoanType(loanType.id, { isActive: isActivating })
        }
    })
}

// ============================================================================
// Table Configuration
// ============================================================================

const columns: TableColumn<LoanType>[] = [
    {
        accessorKey: 'name',
        header: getSortableHeader('Name'),
        cell: ({ row }) => `${row.getValue('name')}`,
    },
    {
        accessorKey: 'maxAmount',
        header: getSortableHeader('Max Amount'),
        cell: ({ row }) => {
            const val = row.getValue('maxAmount') as number
            return `₱${val.toLocaleString()}`
        }
    },
    {
        accessorKey: 'interestRate',
        header: getSortableHeader('Interest Rate'),
        cell: ({ row }) => `${row.getValue('interestRate')}%`
    },
    {
        accessorKey: 'maxRepaymentMonths',
        header: getSortableHeader('Max Term'),
        cell: ({ row }) => `${row.getValue('maxRepaymentMonths')} mos`
    },
    {
        accessorKey: 'isActive',
        header: getSortableHeader('Status'),
        cell: ({ row }) => {
            const isActive = row.getValue('isActive') as boolean
            return h(UBadge, {
                label: isActive ? 'Active' : 'Inactive',
                color: isActive ? 'success' : 'neutral',
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
            const isActive = row.original.isActive
            const items: DropdownMenuItem[][] = [
                [
                    {
                        label: isActive ? 'Deactivate' : 'Activate',
                        icon: isActive ? 'i-lucide-power-off' : 'i-lucide-power',
                        onSelect: () => handleToggleStatus(row.original)
                    },
                    {
                        label: 'Edit',
                        icon: 'i-lucide-edit',
                        onSelect: () => handleEditLoanType(row.original)
                    }
                ],
                [
                    {
                        label: 'Delete',
                        icon: 'i-lucide-trash',
                        color: 'error',
                        onSelect: () => handleDeleteLoanType(row.original)
                    }
                ]
            ]

            return h(UDropdownMenu, {
                items,
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
</script>

<template>
    <!-- <UPageCard title="Loan Types Configuration"
        description="Manage the different types of loans available to employees, including their terms and limits."
        variant="naked" orientation="horizontal" class="border-b border-default rounded-none p-4 sm:p-6">
        <div class="flex justify-end gap-2 flex-1">
            <TableGlobalFilter v-model="globalFilter" />
            <TableColumnToggle :table="table" />
        </div>
    </UPageCard> -->
    <UDashboardToolbar :ui="{ root: 'min-h-(--ui-header-height)' }">
        <TableGlobalFilter v-model="globalFilter" />
        <TableColumnToggle :table="table" />
    </UDashboardToolbar>

    <UTable sticky ref="table" :data="loanTypes" :columns="columns" :loading="pending"
        v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" :ui="{ th: 'sm:px-6', td: 'sm:px-6' }" class="flex-1 scrollbar">
        <template #empty>
            <Empty :loading="pending" title="No Loan Types"
                description="There are no loan types configured. Add a new loan type to get started."
                icon="i-lucide-landmark" loading-title="Retrieving Loan Types"
                loading-description="Please wait while we load the configuration.">
                <template #action>
                    <UButton label="Add Loan Type" icon="i-lucide-plus" color="primary" size="lg"
                        @click="events.emit('addLoanType')" />
                </template>
            </Empty>
        </template>
    </UTable>

    <LoanTypeModal v-model:open="isAddModalOpen" @submit="handleAddLoanType" />

    <LogsDrawer v-model:open="isDrawerOpen" namespace="loan-types" />
</template>

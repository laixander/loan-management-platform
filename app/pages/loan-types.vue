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
    isTable: true,
    // headerActions: [
    //     { label: 'Activity Logs', icon: 'i-lucide-scroll-text', event: 'viewLogs', variant: 'ghost' },
    //     { label: 'Add Loan Type', icon: 'i-lucide-plus', event: 'addLoanType', color: 'primary' }
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
const formModal = overlay.create(LoanTypeModal)
const confirmModal = overlay.create(ConfirmationModal)

// Local State
const isAddModalOpen = ref(false)
const isDrawerOpen = ref(false)
const pending = ref(false)

const isAuthorized = computed(() => ['HR', 'Admin'].includes(authStore.currentRole ?? ''))

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

async function handleAddLoanType(form: any) {
    pending.value = true
    await LoanService.addLoanType(form)
    pending.value = false
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
                onConfirm: async () => {
                    pending.value = true
                    await LoanService.updateLoanType(loanType.id, form)
                    pending.value = false
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
        onConfirm: async () => {
            pending.value = true
            await LoanService.deleteLoanType(loanType.id)
            pending.value = false
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
        onConfirm: async () => {
            pending.value = true
            await LoanService.updateLoanType(loanType.id, { isActive: isActivating })
            pending.value = false
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

const viewMode = ref<'list' | 'card'>('list')
</script>

<template>
    <AuthGate v-if="!isAuthorized" title="HR / Admin Access Required" description="You need HR or Admin privileges to manage loan configurations." icon="i-lucide-lock" />

    <template v-else>
        <UPageCard title="Loan Types Configuration"
            description="Manage the different types of loans available to employees, including their terms and limits."
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
                <UButton label="Add Loan Type" icon="i-lucide-plus" @click="events.emit('addLoanType')" />
            </Teleport>
        </ClientOnly>

        <UTable v-if="viewMode === 'list'" sticky ref="table" :data="loanStore.types" :columns="columns" :loading="pending"
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

        <div v-else class="flex-1 overflow-y-auto scrollbar p-4 sm:p-6">
            <Empty v-if="loanStore.types.length === 0" :loading="pending" title="No Loan Types"
                description="There are no loan types configured. Add a new loan type to get started."
                icon="i-lucide-landmark" loading-title="Retrieving Loan Types"
                loading-description="Please wait while we load the configuration.">
                <template #action>
                    <UButton label="Add Loan Type" icon="i-lucide-plus" color="primary" size="lg"
                        @click="events.emit('addLoanType')" />
                </template>
            </Empty>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <UCard v-for="value in loanStore.types" :key="value.id" variant="subtle"
                    class="hover:ring-2 hover:ring-primary transition-all duration-200 shadow-sm flex flex-col h-full">
                    <template #header>
                        <div class="flex items-start justify-between">
                            <div>
                                <!-- <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ value.id }}</p> -->
                                <h3 class="text-lg font-bold">{{ value.name }}</h3>
                                <p v-if="value.description" class="text-sm text-muted">{{ value.description }}</p>
                            </div>
                            <UDropdownMenu :items="[[
                                { label: 'Edit', icon: 'i-lucide-edit', onSelect: () => handleEditLoanType(value) },
                                { label: value.isActive ? 'Deactivate' : 'Activate', icon: value.isActive ? 'i-lucide-power-off' : 'i-lucide-power', onSelect: () => handleToggleStatus(value) }
                            ], [
                                { label: 'Delete', icon: 'i-lucide-trash', color: 'error', onSelect: () => handleDeleteLoanType(value) }
                            ]]" :content="{ align: 'end' }" size="sm">
                                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" />
                            </UDropdownMenu>
                        </div>
                    </template>
                    <div class="*:py-2 *:first:pt-0 *:last:pb-0 *:flex *:items-center *:justify-between text-sm divide-y divide-default">
                        <div>
                            <span class="text-muted">Status</span>
                            <UBadge :label="value.isActive ? 'Active' : 'Inactive'" :color="value.isActive ? 'success' : 'neutral'" variant="subtle" size="sm" />
                        </div>
                        <div>
                            <span class="text-muted">Max Amount</span>
                            <span class="font-semibold">₱{{ value.maxAmount.toLocaleString() }}</span>
                        </div>
                        <div>
                            <span class="text-muted">Interest Rate</span>
                            <span class="font-semibold">{{ value.interestRate }}%</span>
                        </div>
                        <div>
                            <span class="text-muted">Max Term</span>
                            <span class="font-semibold">{{ value.maxRepaymentMonths }} mos</span>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>

        <LoanTypeModal v-model:open="isAddModalOpen" @submit="handleAddLoanType" />

        <LogsDrawer v-model:open="isDrawerOpen" namespace="loan-types" />
    </template>
</template>

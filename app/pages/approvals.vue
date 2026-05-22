<script setup lang="ts">
// ============================================================================
// Imports
// ============================================================================
import { h, ref, useTemplateRef, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useOverlay } from '#imports'
import { UBadge, UButton, UDropdownMenu } from '#components'

// Types
import type { ApprovalStep, ApprovalRole } from '~/types'

// Components
import ApprovalModal from '~/components/ApprovalModal.vue'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Approval Queue',
    isTable: true,
    headerActions: [
        { label: 'Activity Logs', icon: 'i-lucide-clipboard-list', event: 'viewLogs', variant: 'ghost' },
    ]
})

// ============================================================================
// Composables & State
// ============================================================================
const { steps, processStep, isPending: pending } = useApprovals()
const { currentRole } = useDemoAuth()
const events = useEvents()
const overlay = useOverlay()

// Modals
const formModal = overlay.create(ApprovalModal)

// Local State
const isAddModalOpen = ref(false)
const isDrawerOpen = ref(false)
const selectedStep = ref<ApprovalStep | null>(null)

// Filter for role: Admin sees everything. Others see only their role's pending tasks.
// Note: We only show Pending tasks in the queue.
const filteredQueue = computed(() => {
    return steps.value.filter(s => {
        const isPending = s.status === 'Pending'
        const matchesRole = currentRole.value === 'Admin' || s.role === currentRole.value
        return isPending && matchesRole
    })
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

function handleReview(step: ApprovalStep) {
    selectedStep.value = step
    isAddModalOpen.value = true
}

function handleFormSubmit(form: any) {
    if (selectedStep.value) {
        processStep(selectedStep.value.id, form.status, form.comments)
    }
}

// ============================================================================
// Table Configuration
// ============================================================================

function getRoleColor(role: ApprovalRole) {
    switch (role) {
        case 'Supervisor': return 'primary'
        case 'HR': return 'secondary'
        case 'Finance': return 'warning'
        case 'Payroll': return 'success'
        case 'Admin': return 'error'
        default: return 'neutral'
    }
}

const columns: TableColumn<ApprovalStep>[] = [
    {
        accessorKey: 'loanRef',
        header: getSortableHeader('Reference'),
        cell: ({ row }) => `${row.getValue('loanRef')}`
    },
    {
        accessorKey: 'employeeName',
        header: getSortableHeader('Applicant'),
        cell: ({ row }) => `${row.getValue('employeeName')}`
    },
    {
        accessorKey: 'requestedAmount',
        header: getSortableHeader('Requested Amount (₱)'),
        meta: { class: { td: 'text-right', th: 'text-right' } },
        cell: ({ row }) => {
            const val = row.getValue('requestedAmount') as number
            return h('span', { class: 'font-medium' }, `₱${val.toLocaleString()}`)
        }
    },
    {
        accessorKey: 'stepOrder',
        header: getSortableHeader('Step'),
        cell: ({ row }) => `Step ${row.getValue('stepOrder')}`
    },
    {
        accessorKey: 'role',
        header: getSortableHeader('Required Role'),
        cell: ({ row }) => {
            const role = row.getValue('role') as ApprovalRole
            return h(UBadge, {
                label: role,
                color: getRoleColor(role),
                variant: 'subtle'
            })
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return h(UButton, {
                label: 'Review',
                icon: 'i-lucide-check-circle',
                color: 'primary',
                size: 'sm',
                variant: 'soft',
                onClick: () => handleReview(row.original)
            })
        }
    }
]

const table = useTemplateRef('table')
const globalFilter = ref('')
const columnVisibility = ref({})
</script>

<template>
    <UPageCard title="Approval Queue"
        description="Review and process loan applications assigned to your role."
        variant="naked" orientation="horizontal" class="border-b border-default rounded-none p-4 sm:p-6">
        <div class="flex justify-end gap-2 flex-1 items-center">
            <TableGlobalFilter v-model="globalFilter" />
            <TableColumnToggle :table="table" />
        </div>
    </UPageCard>

    <UTable sticky ref="table" :data="filteredQueue" :columns="columns" :loading="pending"
        v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" :ui="{ th: 'sm:px-6', td: 'sm:px-6' }" class="flex-1 scrollbar">
        <template #empty>
            <Empty :loading="pending" title="No Pending Approvals"
                description="There are currently no applications requiring your review."
                icon="i-lucide-check-square" loading-title="Loading Queue"
                loading-description="Please wait while we sync the approval queue.">
            </Empty>
        </template>
    </UTable>

    <ApprovalModal v-model:open="isAddModalOpen" :step="selectedStep" @submit="handleFormSubmit" />

    <LogsDrawer v-model:open="isDrawerOpen" namespace="approvals" />
</template>

<script setup lang="ts">
import { h, ref, useTemplateRef, computed } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { useOverlay } from '#imports'
import { UButton, UBadge, UDropdownMenu } from '#components'

// Types
import type { User } from '~/types'

// Services & Stores
import { UserService } from '~/services/user.service'
import { useUserStore } from '~/stores/user.store'
import { useAuthStore } from '~/stores/auth.store'

// Components
import UserModal from '~/components/UserModal.vue'
import ConfirmationModal from '~/components/ConfirmationModal.vue'

// ============================================================================
// Page Configuration
// ============================================================================
definePageMeta({
    title: 'Employee Directory',
    description: 'Manage employee profiles, salaries, and system roles.',
    isTable: true,
    headerActions: [
        { label: 'Activity Logs', icon: 'i-lucide-scroll-text', event: 'viewLogs', variant: 'ghost' },
        { label: 'Add Employee', icon: 'i-lucide-plus', event: 'addEmployee', color: 'primary' }
    ]
})

// ============================================================================
// Composables & State
// ============================================================================
const userStore = useUserStore()
const authStore = useAuthStore()
const events = useEvents()
const overlay = useOverlay()

const formModal = overlay.create(UserModal)
const confirmModal = overlay.create(ConfirmationModal)

const isAddModalOpen = ref(false)
const isDrawerOpen = ref(false)
const pending = ref(false)

const isAuthorized = computed(() => ['HR', 'Admin'].includes(authStore.currentRole ?? ''))

// ============================================================================
// Event Listeners
// ============================================================================
events.on('addEmployee', () => {
    isAddModalOpen.value = true
})
events.on('viewLogs', () => {
    isDrawerOpen.value = true
})

// ============================================================================
// Methods
// ============================================================================
async function handleAddEmployee(form: Omit<User, 'id'>) {
    pending.value = true
    await UserService.addUser(form)
    pending.value = false
    isAddModalOpen.value = false
}

function handleEditEmployee(user: User) {
    formModal.open({
        user,
        title: 'Edit Employee',
        onSubmit: async (form: any) => {
            confirmModal.open({
                title: 'Confirm Changes',
                description: `Are you sure you want to save changes to ${form.name}?`,
                confirmLabel: 'Save Changes',
                confirmColor: 'warning',
                onConfirm: async () => {
                    pending.value = true
                    await UserService.updateUser(user.id, form)
                    // If editing self, we might need to update auth store in a real app
                    if (authStore.currentEmployeeId === user.id) {
                        authStore.currentRole = form.role
                    }
                    pending.value = false
                }
            })
        }
    })
}

function handleToggleStatus(user: User) {
    const isActivating = user.status === 'Inactive'
    confirmModal.open({
        title: `${isActivating ? 'Activate' : 'Deactivate'} Employee`,
        description: `Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} ${user.name}?`,
        confirmLabel: isActivating ? 'Activate' : 'Deactivate',
        confirmColor: isActivating ? 'success' : 'warning',
        onConfirm: async () => {
            pending.value = true
            await UserService.updateUser(user.id, { status: isActivating ? 'Active' : 'Inactive' })
            pending.value = false
        }
    })
}

function handleDeleteEmployee(user: User) {
    confirmModal.open({
        title: 'Delete Employee',
        description: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'error',
        onConfirm: async () => {
            pending.value = true
            await UserService.deleteUser(user.id)
            pending.value = false
        }
    })
}

// ============================================================================
// Table Configuration
// ============================================================================
function getRoleColor(role: string) {
    switch (role) {
        case 'Admin': return 'error'
        case 'HR': return 'secondary'
        case 'Finance': return 'warning'
        case 'Payroll': return 'success'
        case 'Supervisor': return 'primary'
        default: return 'neutral'
    }
}

const columns: TableColumn<User>[] = [
    {
        accessorKey: 'name',
        header: getSortableHeader('Employee'),
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'font-medium' }, row.getValue('name')),
            h('span', { class: 'text-xs text-muted' }, row.original.email)
        ])
    },
    {
        accessorKey: 'role',
        header: getSortableHeader('System Role'),
        cell: ({ row }) => {
            const role = row.getValue('role') as string
            return h(UBadge, {
                label: role,
                color: getRoleColor(role),
                variant: 'subtle'
            })
        }
    },
    {
        accessorKey: 'baseSalary',
        header: getSortableHeader('Base Salary (₱)'),
        meta: { class: { td: 'text-right', th: 'text-right' } },
        cell: ({ row }) => {
            const val = row.getValue('baseSalary') as number
            return h('span', { class: 'font-medium' }, `₱${val.toLocaleString()}`)
        }
    },
    {
        accessorKey: 'hireDate',
        header: getSortableHeader('Hire Date'),
        cell: ({ row }) => new Date(row.getValue('hireDate') as string).toLocaleDateString()
    },
    {
        accessorKey: 'status',
        header: getSortableHeader('Status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h(UBadge, {
                label: status,
                color: status === 'Active' ? 'success' : 'neutral',
                variant: 'subtle'
            })
        }
    },
    {
        id: 'actions',
        meta: { class: { td: 'text-right' } },
        cell: ({ row }) => {
            const isActive = row.original.status === 'Active'
            const items: DropdownMenuItem[][] = [
                [
                    {
                        label: 'Edit Profile',
                        icon: 'i-lucide-edit',
                        onSelect: () => handleEditEmployee(row.original)
                    },
                    {
                        label: isActive ? 'Deactivate' : 'Activate',
                        icon: isActive ? 'i-lucide-user-minus' : 'i-lucide-user-check',
                        onSelect: () => handleToggleStatus(row.original)
                    }
                ],
                [
                    {
                        label: 'Delete',
                        icon: 'i-lucide-trash',
                        color: 'error',
                        onSelect: () => handleDeleteEmployee(row.original)
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
    <div v-if="!isAuthorized" class="flex flex-col items-center justify-center h-full flex-1 gap-4 text-center p-6">
        <UIcon name="i-lucide-shield-alert" class="w-16 h-16 text-warning" />
        <h2 class="text-2xl font-bold">HR / Admin Access Required</h2>
    </div>

    <template v-else>
        <UPageCard title="Employee Directory"
            description="Manage employee profiles, salaries, and assign system access roles."
            variant="naked" orientation="horizontal" class="border-b border-default rounded-none p-4 sm:p-6">
            <div class="flex justify-end gap-2 flex-1">
                <TableGlobalFilter v-model="globalFilter" />
                <TableColumnToggle :table="table" />
            </div>
        </UPageCard>

        <UTable sticky ref="table" :data="userStore.users" :columns="columns" :loading="pending"
            v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" :ui="{ th: 'sm:px-6', td: 'sm:px-6' }" class="flex-1 scrollbar">
            <template #empty>
                <Empty :loading="pending" title="No Employees Found"
                    description="No employees exist in the directory."
                    icon="i-lucide-users" loading-title="Retrieving Employees"
                    loading-description="Please wait while we sync the directory.">
                    <template #action>
                        <UButton label="Add Employee" icon="i-lucide-plus" color="primary" size="lg"
                            @click="events.emit('addEmployee')" />
                    </template>
                </Empty>
            </template>
        </UTable>

        <UserModal v-model:open="isAddModalOpen" @submit="handleAddEmployee" />

        <LogsDrawer v-model:open="isDrawerOpen" namespace="users" />
    </template>
</template>

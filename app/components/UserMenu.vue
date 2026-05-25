<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { SystemRole } from '~/types'

defineProps<{
    collapsed?: boolean
}>()

const authStore = useAuthStore()
const colorMode = useColorMode()
const router = useRouter()

const systemRoles: SystemRole[] = ['Admin', 'Employee', 'Finance', 'HR', 'Payroll', 'Supervisor']

const getRoleIcon = (role: SystemRole) => {
    const icons: Record<SystemRole, string> = {
        'Employee': 'i-lucide-user',
        'Supervisor': 'i-lucide-users',
        'HR': 'i-lucide-shield-check',
        'Finance': 'i-lucide-landmark',
        'Payroll': 'i-lucide-wallet',
        'Admin': 'i-lucide-shield-alert'
    }
    return icons[role] || 'i-lucide-user'
}

const items = computed<DropdownMenuItem[][]>(() => [
    // Header Info
    [{
        type: 'label',
        label: authStore.currentRole || 'No Role',
        icon: authStore.currentRole ? getRoleIcon(authStore.currentRole) : 'i-lucide-user',
    }],
    // Role Switcher
    [{
        label: 'Switch Role',
        icon: 'i-lucide-users',
        children: systemRoles.map(role => ({
            label: role,
            icon: getRoleIcon(role),
            type: 'checkbox',
            checked: authStore.currentRole === role,
            onSelect: (e: Event) => {
                e.preventDefault()
                authStore.setRole(role)
            }
        }))
    }],
    // Options
    [{
        label: 'Show All Pages',
        icon: 'i-lucide-layout-list',
        type: 'checkbox',
        checked: authStore.showAllPages,
        onUpdateChecked: (checked: boolean) => {
            authStore.setShowAllPages(checked)
        },
        onSelect: (e: Event) => {
            e.preventDefault()
        }
    }],
    // Theme options
    [{
        label: 'Appearance',
        icon: 'i-lucide-sun-moon',
        children: [{
            label: 'Light',
            icon: 'i-lucide-sun',
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
                e.preventDefault()
                colorMode.preference = 'light'
            }
        }, {
            label: 'Dark',
            icon: 'i-lucide-moon',
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onUpdateChecked(checked: boolean) {
                if (checked) {
                    colorMode.preference = 'dark'
                }
            },
            onSelect(e: Event) {
                e.preventDefault()
            }
        }]
    }],
    // Logout
    [{
        label: 'Log out',
        icon: 'i-lucide-log-out',
        onSelect: () => {
            authStore.logout()
            router.push('/')
        }
    }]
])
</script>

<template>
    <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }">
        <UButton v-bind="{
            label: collapsed ? undefined : (authStore.currentRole || 'Select Role'),
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
        }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated py-2.5"
            :icon="authStore.currentRole ? getRoleIcon(authStore.currentRole) : 'i-lucide-user'" 
            :ui="{ trailingIcon: 'text-dimmed' }" />

    </UDropdownMenu>
</template>

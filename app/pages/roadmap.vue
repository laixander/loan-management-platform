<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
    layout: 'page'
})

// ============================================================================
// Types
// ============================================================================
interface PageItem {
    name: string
    route: string
    type: string
    description: string
    module: string
}

interface Phase {
    id: string
    title: string
    status: 'Not Started' | 'In Progress' | 'Completed'
    color: 'neutral' | 'warning' | 'success'
    icon: string
    description: string
    pages: PageItem[]
}

// ============================================================================
// State
// ============================================================================
const expandedPhase = ref('phase-1')

// ============================================================================
// Data — Build Phases (from DEVDOCS.md page list)
// ============================================================================
const phases: Phase[] = [
    {
        id: 'phase-1',
        title: 'Foundation',
        status: 'Not Started',
        color: 'neutral',
        icon: 'i-lucide-layers',
        description: 'Data entities that everything else depends on. Establish core master data management for loan types and employee records.',
        pages: [
            {
                name: 'Loan Types',
                route: '/loan-types',
                type: 'Table + CRUD',
                module: '§1 Loan Type Management',
                description: 'Admin table of loan categories (Salary, Emergency, Calamity, Equipment, Cash Advance). Create/Edit modal with fields: name, max amount, min tenure, interest rate, repayment period, eligibility rules, required docs, status toggle.'
            },
            {
                name: 'Employee Directory',
                route: '/employees',
                type: 'Table + CRUD',
                module: 'Employee Management',
                description: 'Existing useUsers() pattern extended with loan-relevant fields: department, position, tenure, eligibility status.'
            }
        ]
    },
    {
        id: 'phase-2',
        title: 'Core Workflow',
        status: 'Not Started',
        color: 'neutral',
        icon: 'i-lucide-git-branch',
        description: 'The primary business workflow — application submission and multi-level approval routing.',
        pages: [
            {
                name: 'Loan Applications',
                route: '/loan-applications',
                type: 'Table + CRUD',
                module: '§2 Employee Loan Application',
                description: 'Primary table listing all applications. Columns: ID, Employee, Loan Type, Amount, Status (Draft / Pending / Approved / Rejected / Disbursed), Date. Row actions: View, Approve/Reject, Edit. Create form with loan calculator preview.'
            },
            {
                name: 'Approval Queue',
                route: '/approvals',
                type: 'Table',
                module: '§3 Approval Workflow',
                description: 'Filtered table of pending approvals for the logged-in approver. Actions: Approve, Reject, Add Comment. Shows workflow timeline (Employee → Supervisor → HR → Finance → Payroll).'
            }
        ]
    },
    {
        id: 'phase-3',
        title: 'Financial Lifecycle',
        status: 'Not Started',
        color: 'neutral',
        icon: 'i-lucide-wallet',
        description: 'Track repayments, manage payroll deductions, and monitor outstanding balances across the full financial lifecycle.',
        pages: [
            {
                name: 'Repayment Tracker',
                route: '/repayments',
                type: 'Table',
                module: '§6 Repayment Tracking',
                description: 'Table of active repayments. Columns: Employee, Loan Ref, Outstanding Balance, Next Deduction, Total Paid, Progress %. Detail drawer showing full amortization schedule & payment history.'
            },
            {
                name: 'Payroll Deductions',
                route: '/payroll',
                type: 'Table',
                module: '§5 Payroll Integration',
                description: 'Deduction schedule table per payroll cycle. Columns: Employee, Loan Ref, Deduction Amount, Cycle/Cutoff, Status (Scheduled / Processed / On-Hold). Actions: Hold/Resume, Adjust.'
            }
        ]
    },
    {
        id: 'phase-4',
        title: 'Dashboard & Reports',
        status: 'Not Started',
        color: 'neutral',
        icon: 'i-lucide-bar-chart-3',
        description: 'Visualizations and analytics once data entities exist — KPIs, charts, and exportable reports.',
        pages: [
            {
                name: 'Dashboard',
                route: '/dashboard',
                type: 'Dashboard',
                module: '§8 Reporting & Analytics',
                description: 'KPI stat cards (Active Loans, Pending Approvals, Monthly Collections, Total Outstanding Balance), charts (loan distribution by type, monthly disbursements, collection rate trends, loan aging).'
            },
            {
                name: 'Reports',
                route: '/reports',
                type: 'Dashboard',
                module: '§8 Reporting',
                description: 'Sub-tabs: Active Loans Report, Outstanding Balances, Deduction Summaries, Loan Aging, Employee Loan History. Exportable tables + charts.'
            }
        ]
    },
    {
        id: 'phase-5',
        title: 'Self-Service Portal',
        status: 'Not Started',
        color: 'neutral',
        icon: 'i-lucide-user-check',
        description: 'Employee-facing portal views for applying and monitoring personal loan activity.',
        pages: [
            {
                name: 'My Loans',
                route: '/my-loans',
                type: 'Table + Cards',
                module: 'Employee Self-Service',
                description: 'Employee view of their own loans — active loans as stat cards at top, table of all loan history below. Detail drawer with repayment schedule, remaining balance, and download statement action.'
            },
            {
                name: 'Apply for Loan',
                route: '/my-loans/apply',
                type: 'Form',
                module: '§2 Application',
                description: 'Multi-step form: Select loan type → Review eligibility → Fill details → Upload docs → Submit. Includes inline loan calculator.'
            }
        ]
    },
    {
        id: 'phase-6',
        title: 'Governance & Config',
        status: 'Not Started',
        color: 'neutral',
        icon: 'i-lucide-shield-check',
        description: 'System administration, audit trails, and configurable business rules.',
        pages: [
            {
                name: 'Audit Logs',
                route: '/audit-logs',
                type: 'Table',
                module: '§9 Audit & Compliance',
                description: 'Read-only table of all system activity. Columns: Timestamp, User, Action, Entity, Details. Filter by date range, action type, user.'
            },
            {
                name: 'Settings',
                route: '/settings',
                type: 'Form / Tabs',
                module: '§Configurable Rules',
                description: 'Tabbed settings: General, Approval Workflow Config, Notification Preferences, Payroll Integration Config, Eligibility Rules.'
            }
        ]
    }
]

// ============================================================================
// Sidebar Navigation Preview
// ============================================================================
const sidebarGroups = [
    { label: 'Dashboard', icon: 'i-lucide-chart-line', route: '/dashboard' },
    {
        label: 'Loan Management', icon: 'i-lucide-landmark', children: [
            { label: 'Loan Types', route: '/loan-types' },
            { label: 'Applications', route: '/loan-applications' },
            { label: 'Repayments', route: '/repayments' }
        ]
    },
    { label: 'Approvals', icon: 'i-lucide-check-circle', route: '/approvals' },
    {
        label: 'Payroll', icon: 'i-lucide-banknote', children: [
            { label: 'Deductions', route: '/payroll' }
        ]
    },
    {
        label: 'Self-Service', icon: 'i-lucide-user', children: [
            { label: 'My Loans', route: '/my-loans' },
            { label: 'Apply for Loan', route: '/my-loans/apply' }
        ]
    },
    {
        label: 'Administration', icon: 'i-lucide-settings', children: [
            { label: 'Employees', route: '/employees' },
            { label: 'Audit Logs', route: '/audit-logs' },
            { label: 'Settings', route: '/settings' }
        ]
    },
    { label: 'Reports', icon: 'i-lucide-file-bar-chart', route: '/reports' }
]

// ============================================================================
// Computed
// ============================================================================
const totalPages = computed(() => phases.reduce((sum, p) => sum + p.pages.length, 0))
const completedPages = computed(() => phases.reduce((sum, p) => {
    if (p.status === 'Completed') return sum + p.pages.length
    return sum
}, 0))
const completedPhases = computed(() => phases.filter(p => p.status === 'Completed').length)
const overallProgress = computed(() => totalPages.value > 0 ? Math.round((completedPages.value / totalPages.value) * 100) : 0)

// ============================================================================
// Methods
// ============================================================================
function getStatusBadgeColor(status: Phase['status']): 'neutral' | 'warning' | 'success' {
    if (status === 'Completed') return 'success'
    if (status === 'In Progress') return 'warning'
    return 'neutral'
}

function getStatusIcon(status: Phase['status']): string {
    if (status === 'Completed') return 'i-lucide-check-circle'
    if (status === 'In Progress') return 'i-lucide-play-circle'
    return 'i-lucide-circle'
}

function getTypeColor(type: string): 'primary' | 'secondary' | 'success' | 'warning' {
    if (type.includes('Dashboard')) return 'primary'
    if (type.includes('Table')) return 'secondary'
    if (type.includes('Form')) return 'warning'
    return 'success'
}
</script>

<template>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">

        <!-- ── Header ───────────────────────────────────────────────────── -->
        <div
            class="relative overflow-hidden py-16 sm:py-20 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-gradient-to-br from-primary-500/5 via-transparent to-emerald-500/5">
            <div
                class="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

            <UContainer>
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 mb-4">
                        <UIcon name="i-lucide-map" class="size-4" />
                        <span>Implementation Roadmap</span>
                    </div>
                    <h1
                        class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                        Pages to <br />
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-500">Build</span>
                    </h1>
                    <p class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                        A comprehensive list of all pages and modules derived from the DEVDOCS specification, organized
                        into 6 build phases by dependency chain and value delivery.
                    </p>
                </div>
            </UContainer>
        </div>

        <!-- ── Progress Summary Bar ─────────────────────────────────────── -->
        <UContainer class="py-8">
            <div
                class="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div class="md:col-span-1 space-y-1">
                    <span
                        class="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Overall
                        Progress</span>
                    <span class="text-3xl font-extrabold text-neutral-900 dark:text-white">{{ overallProgress }}%
                        Done</span>
                </div>
                <div class="md:col-span-2">
                    <div
                        class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-200/30 dark:border-neutral-700/30">
                        <div class="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-1000"
                            :style="{ width: overallProgress + '%' }" />
                    </div>
                </div>
                <div
                    class="md:col-span-1 flex gap-3 justify-end text-xs text-neutral-500 dark:text-neutral-400">
                    <div
                        class="text-center px-3 py-1 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50">
                        <span class="font-bold text-neutral-900 dark:text-white block">{{ completedPhases }}/{{
                            phases.length }}</span>
                        Phases Done
                    </div>
                    <div
                        class="text-center px-3 py-1 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50">
                        <span class="font-bold text-neutral-900 dark:text-white block">{{ completedPages }}/{{
                            totalPages }}</span>
                        Pages Done
                    </div>
                </div>
            </div>
        </UContainer>

        <!-- ── Main Content ─────────────────────────────────────────────── -->
        <UContainer class="pb-16 grid grid-cols-1 lg:grid-cols-3 gap-10">

            <!-- ── Left: Build Phases ────────────────────────────────────── -->
            <div class="lg:col-span-2 space-y-6">
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <UIcon name="i-lucide-milestone" class="text-primary-500" />
                    Build Phases
                </h2>

                <div class="space-y-4">
                    <div v-for="(phase, phaseIndex) in phases" :key="phase.id" @click="expandedPhase = phase.id"
                        :class="[
                            'p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden',
                            expandedPhase === phase.id
                                ? 'bg-white dark:bg-neutral-900 border-primary-500/40 shadow-md'
                                : 'bg-white dark:bg-neutral-900 border-neutral-200/50 dark:border-neutral-800/50 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700'
                        ]">

                        <!-- Side accent bar -->
                        <div class="absolute left-0 top-0 bottom-0 w-1.5 transition-colors" :class="{
                            'bg-emerald-500': phase.status === 'Completed',
                            'bg-amber-500': phase.status === 'In Progress',
                            'bg-neutral-300 dark:bg-neutral-700': phase.status === 'Not Started'
                        }" />

                        <!-- Phase header -->
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                            <div class="flex items-center gap-3">
                                <div
                                    class="size-9 rounded-xl bg-primary-500/10 flex items-center justify-center font-extrabold text-sm text-primary-600 dark:text-primary-400 shrink-0">
                                    {{ phaseIndex + 1 }}
                                </div>
                                <div>
                                    <h3 class="font-bold text-base text-neutral-900 dark:text-white">{{ phase.title }}
                                    </h3>
                                    <span class="text-xs text-neutral-500">{{ phase.pages.length }} pages</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <UBadge :color="getStatusBadgeColor(phase.status)" variant="subtle" size="sm"
                                    :icon="getStatusIcon(phase.status)">
                                    {{ phase.status }}
                                </UBadge>
                                <UIcon
                                    :name="expandedPhase === phase.id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                                    class="size-4 text-neutral-400" />
                            </div>
                        </div>

                        <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pl-12">
                            {{ phase.description }}
                        </p>

                        <!-- Expanded page details -->
                        <div v-if="expandedPhase === phase.id"
                            class="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800 space-y-3 animate-slide-down pl-12">
                            <span
                                class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Pages
                                to Build</span>

                            <div class="space-y-3">
                                <div v-for="page in phase.pages" :key="page.route"
                                    class="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl">

                                    <div class="flex items-start justify-between gap-3 mb-2">
                                        <div class="flex items-center gap-2">
                                            <UIcon :name="phase.icon"
                                                class="size-4 text-primary-500 shrink-0 mt-0.5" />
                                            <h4 class="font-bold text-sm text-neutral-900 dark:text-white">
                                                {{ page.name }}
                                            </h4>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <UBadge :color="getTypeColor(page.type)" variant="subtle" size="xs">
                                                {{ page.type }}
                                            </UBadge>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2 mb-2">
                                        <code
                                            class="text-[11px] font-mono text-primary-600 dark:text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded">{{
                                                page.route }}</code>
                                        <span class="text-[10px] text-neutral-400">{{ page.module }}</span>
                                    </div>

                                    <p
                                        class="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        {{ page.description }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Right: Sidebar Preview + Notes ────────────────────────── -->
            <div class="space-y-6">

                <!-- Sidebar Navigation Preview -->
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <UIcon name="i-lucide-panel-left" class="text-primary-500" />
                    Sidebar Structure
                </h2>

                <div
                    class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm space-y-1">
                    <div v-for="group in sidebarGroups" :key="group.label">
                        <!-- Top-level item -->
                        <div class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm"
                            :class="group.children ? 'font-semibold text-neutral-900 dark:text-white mt-2' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-950'">
                            <UIcon :name="group.icon" class="size-4 text-neutral-500 shrink-0" />
                            <span>{{ group.label }}</span>
                            <code v-if="group.route"
                                class="ml-auto text-[9px] font-mono text-neutral-400 hidden sm:block">{{
                                    group.route }}</code>
                        </div>

                        <!-- Children -->
                        <div v-if="group.children" class="ml-6 space-y-0.5">
                            <div v-for="child in group.children" :key="child.label"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-950">
                                <div class="size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />
                                <span>{{ child.label }}</span>
                                <code class="ml-auto text-[9px] font-mono text-neutral-400 hidden sm:block">{{
                                    child.route }}</code>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Technical Notes -->
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <UIcon name="i-lucide-code-2" class="text-primary-500" />
                    Technical Notes
                </h2>

                <div
                    class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm space-y-3">
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Every page follows the <strong>Agent Kit patterns</strong> established in this project:
                    </p>
                    <div class="space-y-2">
                        <div v-for="note in [
                            { icon: 'i-lucide-settings-2', text: 'definePageMeta() for title, isTable, headerActions' },
                            { icon: 'i-lucide-layers', text: 'useOverlay() for modals & drawers' },
                            { icon: 'i-lucide-radio', text: 'useEvents() for header → page communication' },
                            { icon: 'i-lucide-scroll-text', text: 'useLogger() + LogsDrawer for audit trails' },
                            { icon: 'i-lucide-hard-drive', text: 'useState() + localStorage for demo persistence' },
                            { icon: 'i-lucide-database-zap', text: 'useDemoSeeder() for sample data' },
                            { icon: 'i-lucide-tag', text: 'New types added to types/index.ts' }
                        ]" :key="note.text"
                            class="flex items-start gap-2 text-[11px] text-neutral-700 dark:text-neutral-300">
                            <UIcon :name="note.icon" class="size-3.5 text-primary-500 shrink-0 mt-0.5" />
                            <span>{{ note.text }}</span>
                        </div>
                    </div>
                </div>

                <!-- Cross-Cutting Note -->
                <UAlert icon="i-lucide-info" color="primary" variant="subtle" title="Notifications"
                    description="The Notifications module (§7) is handled cross-cutting via useAppToast() and fires contextually from actions on other pages — no dedicated page needed." />
            </div>

        </UContainer>
    </div>
</template>

<style scoped>
.animate-slide-down {
    animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
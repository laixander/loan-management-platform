<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
    layout: false,
    title: 'Changelog'
})

const isScrolled = ref(false)

onMounted(() => {
    const handleScroll = () => {
        isScrolled.value = window.scrollY > 120
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
    })
})

interface ChangelogEntry {
    date: string
    version: string
    title: string
    description: string
    changes: {
        type: 'feature' | 'fix' | 'refactor' | 'chore'
        text: string
    }[]
}

const changelogs: ChangelogEntry[] = [
    {
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        version: 'v0.1.3',
        title: 'Documentation Enhancements & UI Polish',
        description: 'Finalized technical documentation views, optimized component structures, and resolved various UI state bugs across reports and presentation modes.',
        changes: [
            { type: 'feature', text: 'Completed the Architecture & Data tab in Documentation, mapping actual TypeScript domain models (User, LoanApplication, RepaymentSchedule) directly to the UI.' },
            { type: 'refactor', text: 'Refactored Primary User Personas in Documentation to use a clean, data-driven array structure.' },
            { type: 'feature', text: 'Implemented an animated, auto-hiding top navigation bar in Presentation mode for a cleaner full-screen experience.' },
            { type: 'fix', text: 'Resolved table layout overflow issues in the Integrations matrix by overriding Nuxt UI whitespace rules.' },
            { type: 'fix', text: 'Fixed the Application Trends chart in the Reports module to accurately flatten out when global data is reset.' },
            { type: 'fix', text: 'Corrected z-index layering in Presentation mode to ensure the Color Mode toggle remains fully interactive.' }
        ]
    },
    {
        date: 'May 25, 2026',
        version: 'v0.1.2',
        title: 'Centralized Logging & Semantic Event Tracking',
        description: 'Refactored logging mechanism to use a domain-specific useAppLogger wrapper, standardizing telemetry and cleaning up view files.',
        changes: [
            { type: 'feature', text: 'Created centralized useAppLogger composable with strongly-typed helper methods for every domain.' },
            { type: 'refactor', text: 'Refactored core composables (Repayments, Approvals, Loan Applications, Loan Types, Payroll, Schedules) to use the new semantic logger.' },
            { type: 'refactor', text: 'Cleaned up and refactored UI views by replacing raw logger.addLog calls with clean domain helpers.' },
            { type: 'chore', text: 'Ensured zero type verification errors using strict TypeScript checks across all components.' }
        ]
    },
    {
        date: 'May 21, 2026',
        version: 'v0.1.1',
        title: 'Authentication & Role-Based Access Control',
        description: 'Implemented a complete mock authentication system with role-based routing and a cleaner layout architecture.',
        changes: [
            { type: 'feature', text: 'Added a new interactive Login Page (index.vue) with a role selection dropdown.' },
            { type: 'feature', text: 'Implemented global auth middleware to protect all routes and redirect unauthenticated users.' },
            { type: 'feature', text: 'Added dynamic role-based visibility to the sidebar navigation in the default layout.' },
            { type: 'refactor', text: 'Moved Agent Kit pages to their own dedicated layout (agent.vue) to separate them from the main application.' },
            { type: 'refactor', text: 'Removed the role switcher and "Show All Pages" toggle from the Demo Floating Action Button (FAB).' },
            { type: 'refactor', text: 'Updated useDemoAuth composable to start with a null role and added logout functionality.' },
            { type: 'refactor', text: 'Moved the "Run Payroll" batch action to the page header in the Payroll module for better UI consistency.' },
            { type: 'refactor', text: 'Moved Demo Floating Action Button (FAB) out of individual layouts to the global app.vue root.' },
            { type: 'refactor', text: 'Relocated documentation and roadmap pages under the /docs route namespace.' },
            { type: 'chore', text: 'Updated all Agent Kit pages to explicitly use the new agent layout.' },
            { type: 'chore', text: 'Set docs pages to have no layout wrapper (layout: false) for standalone viewing.' }
        ]
    },
    {
        date: 'May 20, 2026', // Assuming previous work was recently prior to auth updates
        version: 'v0.1.0',
        title: 'Foundation & Core Loan Operations',
        description: 'Initial release of the core loan management entities, financial ledger, and employee self-service modules.',
        changes: [
            { type: 'feature', text: 'Implemented Loan Types module with CRUD operations and dynamic eligibility rules.' },
            { type: 'feature', text: 'Implemented Loan Applications module featuring multi-stage approval routing and automated interest calculation.' },
            { type: 'feature', text: 'Built the Approval Queue with timeline tracking for Supervisor, HR, Finance, and Payroll reviews.' },
            { type: 'feature', text: 'Developed the Repayment Tracker and immutable financial ledger for monitoring outstanding balances.' },
            { type: 'feature', text: 'Created Payroll Deductions integration to batch-process scheduled payments and auto-decrement balances.' },
            { type: 'feature', text: 'Launched Employee Self-Service (My Loans) portal for users to track their active loans and repayment progress.' },
            { type: 'feature', text: 'Added Demo Seeder functionality to populate realistic mock data across all modules.' },
            { type: 'refactor', text: 'Established baseline Role-Based Access Control (RBAC) simulated via the useDemoAuth composable.' }
        ]
    }
]

function getBadgeColor(type: string) {
    switch (type) {
        case 'feature': return 'primary'
        case 'fix': return 'error'
        case 'refactor': return 'warning'
        case 'chore': return 'neutral'
        default: return 'neutral'
    }
}
</script>

<template>
    <!-- ── Static Banner Header (Standard Flow) ─────────────────────── -->
    <div 
        class="relative border-b border-default py-8 overflow-hidden min-h-[33vh] flex flex-col justify-center transition-all duration-500 ease-in-out"
        :class="isScrolled ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'"
    >
        <UContainer class="relative">
            <div class="absolute -top-18 right-4">
                <UColorModeButton color="primary" />
            </div>
            <UBadge label="System Updates" icon="i-lucide-file-text" variant="subtle" color="primary" size="lg" class="rounded-full px-3 py-1.5 w-fit" />
            <div class="flex flex-col gap-3 mt-6">
                <h1 class="text-3xl sm:text-5xl text-pretty font-bold text-highlighted">
                    Changelog &amp; <span class="text-primary-600 dark:text-primary-400">Release Notes</span>
                </h1>
                <p class="text-lg text-pretty text-primary-600 dark:text-primary-700 font-light">
                    Keep track of all new features, improvements, and architectural updates to the Loan Management Platform.
                </p>
            </div>
        </UContainer>
        <BackgroundGrid bg-color="bg-primary-50 dark:bg-primary-950/50" />
    </div>

    <!-- ── Fixed Mini-Navbar (Slides in smoothly on scroll, zero layout shift) ── -->
    <div 
        class="fixed top-0 left-0 right-0 z-40 border-b border-default bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm transition-all duration-300 ease-in-out"
        :class="isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'"
    >
        <UContainer class="py-3 flex items-center justify-between">
            <h1 class="text-lg font-bold text-highlighted leading-none">
                Changelog &amp; <span class="text-primary-600 dark:text-primary-400">Release Notes</span>
            </h1>
            <div class="flex items-center gap-3">
                <UColorModeButton color="primary" class="cursor-pointer hover:scale-105 transition-transform" />
            </div>
        </UContainer>
    </div>

    <!-- ── Timeline ─────────────────────────────────────────────────── -->
    <UContainer class="py-12">
        <div v-for="(log, index) in changelogs" :key="index" class="relative pl-8 sm:pl-32 pb-6 last:pb-0">
            
            <!-- Timeline Line -->
            <div class="absolute left-[11px] sm:left-[107px] top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-800"
                :class="{ 'bottom-auto h-full': index !== changelogs.length - 1 }" />
            
            <!-- Timeline Dot -->
            <div class="absolute left-0 sm:left-24 top-2 flex items-center justify-center w-6 h-6 rounded-full bg-primary-500/20 border-2 border-primary-500 z-10">
                <div class="w-2 h-2 rounded-full bg-primary-500" />
            </div>

            <!-- Date & Version (Desktop: Left, Mobile: Top) -->
            <div class="sm:absolute sm:left-0 sm:w-20 sm:text-right sm:top-1 mb-2 sm:mb-0">
                <span class="block text-xs font-medium text-dimmed whitespace-nowrap">{{ log.date }}</span>
                <span class="block text-sm font-bold text-primary whitespace-nowrap">{{ log.version }}</span>
            </div>

            <!-- Content Card -->
            <UCard variant="subtle" class="shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-1">{{ log.title }}</h2>
                <p class="text-sm text-dimmed mb-6">{{ log.description }}</p>

                <div class="space-y-3">
                    <div v-for="(change, cIndex) in log.changes" :key="cIndex" 
                        class="flex items-start gap-3 text-sm">
                        <div class="shrink-0 w-20">
                            <UBadge :color="getBadgeColor(change.type)" variant="soft" class="uppercase text-[10px] font-bold pt-[5px] w-full rounded-full justify-center">
                                {{ change.type }}
                            </UBadge>
                        </div>
                        <span class="text-toned leading-relaxed">{{ change.text }}</span>
                    </div>
                </div>
            </UCard>
        </div>
    </UContainer>
</template>

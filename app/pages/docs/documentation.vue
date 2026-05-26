<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
    layout: false,
    title: 'User Manual'
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

const items = [
    { slot: 'overview', label: 'Overview & Users', icon: 'i-lucide-book-open' },
    { slot: 'modules', label: 'Functional Modules', icon: 'i-lucide-layers' },
    { slot: 'workflows', label: 'Flows & Integrations', icon: 'i-lucide-git-commit' },
    { slot: 'technical', label: 'Architecture & Data', icon: 'i-lucide-cpu' }
]

const modulesData = [
  {
    id: 1,
    title: 'Loan Type Management',
    icon: 'i-lucide-settings-2',
    color: 'emerald',
    desc: 'Enables HR administrators to configure diverse loan catalogs, defining strict eligibility bounds and financial settings.',
    features: [
      'Create and manage custom loan categories',
      'Define parameters: Maximum amounts, interest rates, tenure caps, and eligibility conditions',
      'Configure required document checklists per loan type',
      'Toggle active status of loan offerings'
    ],
    examples: ['Salary Loan', 'Emergency Loan', 'Calamity Loan', 'Equipment Loan', 'Cash Advance']
  },
  {
    id: 2,
    title: 'Employee Loan Application',
    icon: 'i-lucide-file-text',
    color: 'blue',
    desc: 'Intuitive self-service wizard that auto-fills employee metadata and assists with simulations.',
    features: [
      'Interactive application wizard with auto-filled HRIS fields',
      'Real-time loan calculators to simulate tenure, interest, and monthly pay impact',
      'Instant pre-submission eligibility validation',
      'Save as draft capability with secure file attachment uploads'
    ],
    validations: [
      'Employment status validation',
      'Minimum tenure threshold checks',
      'Active loan limit limits',
      'Net-take-home pay threshold compliance'
    ]
  },
  {
    id: 3,
    title: 'Approval Workflow Engine',
    icon: 'i-lucide-git-branch',
    color: 'pink',
    desc: 'A flexible routing engine supporting sequential or parallel approvals with granular delegation rules.',
    features: [
      'Configurable multi-level routing (Sequential & Parallel)',
      'Dynamic routing based on department or requested loan amount',
      'Automated email/in-app notification triggers',
      'Escalation protocols for stale applications and temporary delegation parameters'
    ],
    flow: 'Employee ➔ Department Supervisor ➔ HR Administrator ➔ Finance Director ➔ Payroll Officer'
  },
  {
    id: 4,
    title: 'Loan Computation Engine',
    icon: 'i-lucide-calculator',
    color: 'amber',
    desc: 'The mathematical backbone supporting a variety of interest computations and amortization plans.',
    features: [
      'Generation of itemized amortization schedules (Principal vs. Interest)',
      'Pre-deduction forecast simulation tools',
      'Settlement calculations including early payoff discounts',
      'Adjustment and penalty computations for delayed cycles'
    ],
    models: ['Flat rate simple interest', 'Diminishing balance', 'Fixed amortization (Equal installments)', 'Flexible structure adjustments']
  },
  {
    id: 5,
    title: 'Payroll Integration',
    icon: 'i-lucide-wallet',
    color: 'orange',
    desc: 'Deep bi-directional sync with the core payroll processor for automated salary deductions.',
    features: [
      'Automated deduction extraction based on cutoff dates',
      'Flexible status flags (Hold, Resume, Skip) for specific pay cycles',
      'Automatic deduction of outstanding balance from final pay',
      'Direct integration with electronic payslip generation'
    ]
  },
  {
    id: 6,
    title: 'Loan Repayment Tracking',
    icon: 'i-lucide-trending-up',
    color: 'indigo',
    desc: 'Maintains an absolute real-time ledger of outstanding balances, payments, and restructurings.',
    features: [
      'Real-time dashboard showing aggregate outstanding balances',
      'Granular repayment schedules indicating payment date, amount, and source',
      'System alerts for missed or partial deductions',
      'Manual entry options for bank deposits or direct over-the-counter payments'
    ]
  },
  {
    id: 7,
    title: 'Notifications & Alerts',
    icon: 'i-lucide-bell',
    color: 'yellow',
    desc: 'Keeps all stakeholders aligned at crucial steps of the lifecycle through multichannel communications.',
    channels: [
      { name: 'Email Notifications', desc: 'Disbursal summaries, formal approval letters, and monthly statements' },
      { name: 'In-App Alerts', desc: 'Manager approval prompts, status changes, and general portal updates' },
      { name: 'SMS Reminders', desc: 'Cutoff alerts, settlement receipts, and critical system notifications' }
    ]
  },
  {
    id: 8,
    title: 'Reporting & Analytics',
    icon: 'i-lucide-bar-chart-3',
    color: 'cyan',
    desc: 'Visual dashboards presenting structural metrics to executives, payroll teams, and auditors.',
    metrics: [
      { label: 'Total Released Loans', val: 'Aggregated loan capital deployed' },
      { label: 'Collection Rate', val: 'Percentage of scheduled deductions processed successfully' },
      { label: 'Popular Loan Offerings', val: 'Distribution of capital by loan program' },
      { label: 'Turnaround Time (TAT)', val: 'Average days elapsed from application to disbursement' }
    ]
  },
  {
    id: 9,
    title: 'Audit & Compliance',
    icon: 'i-lucide-shield-check',
    color: 'rose',
    desc: 'Maintains an immutable historical record ensuring transparency and policy alignment.',
    features: [
      'Full audit trail of all settings changes and policy versionings',
      'Immutable logs mapping who approved a loan, when, and under what conditions',
      'Dedicated exports for financial and compliance auditors'
    ]
  }
]
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
            <UBadge label="Documentation" icon="i-lucide-book" variant="subtle" color="primary" size="lg" class="rounded-full px-3 py-1.5 w-fit" />
            <div class="flex flex-col gap-3 mt-6">
                <h1 class="text-3xl sm:text-5xl text-pretty font-bold text-highlighted">
                    Loan Management <span class="text-primary-600 dark:text-primary-400">Platform</span>
                </h1>
                <p class="text-lg text-pretty text-primary-600 dark:text-primary-700 font-light">
                    A comprehensive, digital employee loan suite fully aligned with payroll runs, company policy parameters, approval limits, and multi-tier workflows.
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
                User <span class="text-primary-600 dark:text-primary-400">Manual</span>
            </h1>
            <div class="flex items-center gap-3">
                <UColorModeButton color="primary" class="cursor-pointer hover:scale-105 transition-transform" />
            </div>
        </UContainer>
    </div>

    <!-- ── Manual Content ─────────────────────────────────────────────────── -->
    <UContainer class="py-12">
        <UTabs :items="items" orientation="vertical" variant="link" class="w-full" :ui="{ root: 'items-start sm:gap-6 md:gap-12', list: 'gap-1' }">
            
            <!-- OVERVIEW & USERS -->
            <template #overview>
                <div class="space-y-12 animate-fade-in w-full">
                    <!-- Core Purpose Card -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2 space-y-6">
                            <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                                <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                                    <UIcon name="i-lucide-focus" class="size-6 text-primary" />
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Core Purpose</h2>
                                    <p class="text-sm text-neutral-500">Why this platform exists and what it solves.</p>
                                </div>
                            </div>
                            <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                Managing employee financial assistance programmatically reduces HR overhead while empowering employees. The submodule automates calculations, limits manual entries, and integrates securely with pay schedules.
                            </p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="(item, idx) in [
                                    'Provide structured employee loan programs',
                                    'Digitize loan application & approval',
                                    'Automate salary deductions',
                                    'Monitor balances in real time',
                                    'Reduce manual HR processing',
                                    'Improve financial transparency'
                                ]" :key="idx" class="flex items-center gap-3 p-3 rounded-xl border border-default bg-white dark:bg-neutral-900 shadow-sm">
                                    <UIcon name="i-lucide-check-circle" class="size-5 text-emerald-500 shrink-0" />
                                    <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ item }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Business Value Stats -->
                        <UCard variant="subtle" :ui="{ body: 'flex flex-col gap-6' }" class="bg-gradient-to-br from-primary-50 dark:from-primary-950/30 to-emerald-50 dark:to-emerald-950/30 ring-primary-200 dark:ring-primary-800/50 rounded-2xl h-fit">
                            <h3 class="font-bold text-lg text-neutral-900 dark:text-white leading-none flex items-center gap-2">
                                <UIcon name="i-lucide-trending-up" class="text-primary size-5" />
                                Business Value
                            </h3>
                            <div class="space-y-5">
                                <div>
                                    <div class="flex justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
                                        <span>HR PROCESSING EFFICIENCY</span>
                                        <span class="text-info-600 dark:text-info-400 font-bold">+85%</span>
                                    </div>
                                    <UProgress :model-value="85" color="info" size="sm" />
                                </div>
                                <div>
                                    <div class="flex justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
                                        <span>PAYROLL ACCURACY</span>
                                        <span class="text-success-600 dark:text-success-400 font-bold">100%</span>
                                    </div>
                                    <UProgress :model-value="100" color="success" size="sm" />
                                </div>
                                <div>
                                    <div class="flex justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
                                        <span>DISBURSEMENT TAT REDUCTION</span>
                                        <span class="text-warning-600 dark:text-warning-400 font-bold">-70%</span>
                                    </div>
                                    <UProgress :model-value="70" color="warning" size="sm" />
                                </div>
                            </div>
                        </UCard>
                    </div>

                    <!-- Primary User Personas -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                                <UIcon name="i-lucide-users" class="size-6 text-primary" />
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Primary User Personas</h2>
                                <p class="text-sm text-neutral-500">Roles interacting with the system.</p>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <!-- Employee -->
                            <UCard variant="subtle" class="hover:border-blue-500/30 transition-colors">
                                <div class="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 w-fit mb-4">
                                    <UIcon name="i-lucide-user" class="size-6 shrink-0 flex" />
                                </div>
                                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">Employees</h3>
                                <ul class="text-sm text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4 mb-4">
                                    <li>Apply for loans & check eligibility</li>
                                    <li>Monitor active amortization</li>
                                    <li>Download payment statements</li>
                                </ul>
                                <UBadge color="blue" variant="subtle" size="sm" label="Self-Service" />
                            </UCard>

                            <!-- HR -->
                            <UCard variant="subtle" class="hover:border-emerald-500/30 transition-colors">
                                <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit mb-4">
                                    <UIcon name="i-lucide-settings" class="size-6 shrink-0 flex" />
                                </div>
                                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">HR Administrators</h3>
                                <ul class="text-sm text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4 mb-4">
                                    <li>Configure loan programs & policies</li>
                                    <li>Manage employee profiles</li>
                                    <li>Oversee approval workflows</li>
                                </ul>
                                <UBadge color="emerald" variant="subtle" size="sm" label="Policy Owner" />
                            </UCard>

                            <!-- Payroll -->
                            <UCard variant="subtle" class="hover:border-orange-500/30 transition-colors">
                                <div class="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 w-fit mb-4">
                                    <UIcon name="i-lucide-wallet" class="size-6 shrink-0 flex" />
                                </div>
                                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">Payroll Officers</h3>
                                <ul class="text-sm text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4 mb-4">
                                    <li>Trigger deduction cycles</li>
                                    <li>Manage hold/skip requests</li>
                                    <li>Post payments to pay runs</li>
                                </ul>
                                <UBadge color="orange" variant="subtle" size="sm" label="Executioner" />
                            </UCard>

                            <!-- Finance -->
                            <UCard variant="subtle" class="hover:border-purple-500/30 transition-colors">
                                <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 w-fit mb-4">
                                    <UIcon name="i-lucide-activity" class="size-6 shrink-0 flex" />
                                </div>
                                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">Finance Team</h3>
                                <ul class="text-sm text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4 mb-4">
                                    <li>Audit balance sheets</li>
                                    <li>Release disbursal funds</li>
                                    <li>Generate ledger reports</li>
                                </ul>
                                <UBadge color="purple" variant="subtle" size="sm" label="Auditor" />
                            </UCard>

                            <!-- Approvers -->
                            <UCard variant="subtle" class="hover:border-pink-500/30 transition-colors">
                                <div class="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 w-fit mb-4">
                                    <UIcon name="i-lucide-check-square" class="size-6 shrink-0 flex" />
                                </div>
                                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">Approvers (Supervisors)</h3>
                                <ul class="text-sm text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4 mb-4">
                                    <li>Review request justifications</li>
                                    <li>Approve/reject entries</li>
                                    <li>Track team requests</li>
                                </ul>
                                <UBadge color="pink" variant="subtle" size="sm" label="Gatekeeper" />
                            </UCard>
                        </div>
                    </div>
                </div>
            </template>

            <!-- FUNCTIONAL MODULES -->
            <template #modules>
                <div class="space-y-6 animate-fade-in w-full">
                    <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                        <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                            <UIcon name="i-lucide-layers" class="size-6 text-primary" />
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Core Submodule Modules</h2>
                            <p class="text-sm text-neutral-500">9 independent, loosely-coupled engines processing distinct segments of the loan lifespan.</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <UCard v-for="mod in modulesData" :key="mod.id" variant="subtle" :ui="{ body: 'flex flex-col h-full gap-4 relative overflow-hidden' }" class="group hover:-translate-y-1 transition-transform">
                            <!-- Background color glow -->
                            <div class="absolute -top-6 -right-6 size-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl" :class="`bg-${mod.color}-500`" />
                            
                            <!-- Header -->
                            <div class="flex items-start gap-3">
                                <div class="p-2 rounded-xl shrink-0" :class="`bg-${mod.color}-500/10 text-${mod.color}-500`">
                                    <UIcon :name="mod.icon" class="size-6 shrink-0 flex" />
                                </div>
                                <h3 class="font-bold text-lg text-neutral-900 dark:text-white mt-1 group-hover:text-primary transition-colors">
                                    {{ mod.id }}. {{ mod.title }}
                                </h3>
                            </div>
                            
                            <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {{ mod.desc }}
                            </p>

                            <!-- Features -->
                            <div v-if="mod.features" class="space-y-1.5 mt-2">
                                <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">Key Capabilities</span>
                                <div v-for="(feat, fIdx) in mod.features" :key="fIdx" class="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                    <UIcon name="i-lucide-check" class="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{{ feat }}</span>
                                </div>
                            </div>

                            <!-- Context Data (Validations, Flows, Models, Channels) -->
                            <div class="mt-auto pt-4 flex flex-col gap-3">
                                <div v-if="mod.validations">
                                    <span class="text-[10px] font-bold text-orange-500 uppercase tracking-wider block mb-1">Validation Checks</span>
                                    <div class="flex flex-wrap gap-1.5">
                                        <UBadge v-for="val in mod.validations" :key="val" variant="soft" color="orange" size="sm">{{ val }}</UBadge>
                                    </div>
                                </div>

                                <div v-if="mod.flow">
                                    <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Routing Flow</span>
                                    <div class="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-primary-600 dark:text-primary-400 leading-relaxed break-words">
                                        {{ mod.flow }}
                                    </div>
                                </div>

                                <div v-if="mod.models">
                                    <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Interest Frameworks</span>
                                    <div class="flex flex-wrap gap-1.5">
                                        <UBadge v-for="m in mod.models" :key="m" variant="soft" color="neutral" size="sm">{{ m }}</UBadge>
                                    </div>
                                </div>

                                <div v-if="mod.examples">
                                    <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Standard Types</span>
                                    <div class="flex flex-wrap gap-1.5">
                                        <UBadge v-for="ex in mod.examples" :key="ex" variant="soft" color="neutral" size="sm">{{ ex }}</UBadge>
                                    </div>
                                </div>

                                <div v-if="mod.channels" class="space-y-2">
                                    <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Available Outlets</span>
                                    <div v-for="ch in mod.channels" :key="ch.name" class="flex items-start gap-2 bg-white dark:bg-neutral-900 p-2 rounded-lg border border-default shadow-sm">
                                        <div class="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 shrink-0">{{ ch.name }}:</div>
                                        <div class="text-[11px] text-neutral-500 dark:text-neutral-400">{{ ch.desc }}</div>
                                    </div>
                                </div>

                                <div v-if="mod.metrics" class="grid grid-cols-2 gap-2">
                                    <div v-for="met in mod.metrics" :key="met.label" class="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-default shadow-sm flex flex-col gap-1">
                                        <span class="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 leading-tight">{{ met.label }}</span>
                                        <span class="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-snug">{{ met.val }}</span>
                                    </div>
                                </div>
                            </div>
                        </UCard>
                    </div>
                </div>
            </template>

            <!-- FLOWS & INTEGRATIONS -->
            <template #workflows>
                <div class="space-y-6 animate-fade-in w-full">
                    <UAlert title="Work in Progress" description="This section is currently being constructed." icon="i-lucide-hammer" color="warning" variant="subtle" />
                </div>
            </template>

            <!-- ARCHITECTURE & DATA -->
            <template #technical>
                <div class="space-y-6 animate-fade-in w-full">
                    <UAlert title="Work in Progress" description="This section is currently being constructed." icon="i-lucide-hammer" color="warning" variant="subtle" />
                </div>
            </template>
        </UTabs>
    </UContainer>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

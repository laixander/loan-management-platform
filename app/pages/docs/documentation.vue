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
    { slot: 'technical', label: 'Architecture & Data', icon: 'i-lucide-cpu' },
    { slot: 'design', label: 'Design System', icon: 'i-lucide-palette' }
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

const employeeJourney = [
  { title: 'Access Dashboard', desc: 'Employee signs in to the portal and navigates to the Loan Management widget.' },
  { title: 'Program & Eligibility Review', desc: 'Selects the desired program type (e.g. Salary, Emergency). System runs real-time filters against tenure and existing limits.' },
  { title: 'Simulate & Calculate', desc: 'Adjusts sliders on the calculator to forecast exact amortization payments, checking the net-pay threshold indicator.' },
  { title: 'Wizard Submission', desc: 'Fills required forms (with preloaded details) and uploads supporting proofs/statements.' },
  { title: 'Workflow Routing', desc: 'Application is dispatched into the sequential engine, generating push/email alerts for supervisor validation.' },
  { title: 'HR & Finance Audits', desc: 'Admins verify information, run payroll conflict checks, and approve the request.' },
  { title: 'Disbursal Release', desc: 'Finance registers payment release details. An ledger record is opened initializing outstanding balance.' },
  { title: 'Deductions Triggered', desc: 'Automated scheduler picks up active schedules during payroll runs, recording matching ledger adjustments.' },
  { title: 'Dashboard Monitoring', desc: 'Employee views outstanding balance, next payment timeline, and amortization updates.' },
  { title: 'Ledger Completion', desc: 'Final scheduled deduction executes successfully, balance touches zero, and system marks state as completed.' }
]

const integrations = [
  { name: 'Employee Profiles', key: 'Profiles REST', action: 'Syncs core employment status, hiring anniversary data, and department structures for initial eligibility checks.' },
  { name: 'Payroll Engine', key: 'Payroll Cutoff MQ', action: 'Queues active loan amortization schedules for extraction into dynamic payslip deduction blocks during pay runs.' },
  { name: 'Attendance & Leave', key: 'Compensation REST', action: 'Fetches paid suspension records, leave status, and general hours to determine net-take-home eligibility.' },
  { name: 'Accounting / ERP', key: 'General Ledger API', action: 'Triggers journal ledger adjustments (Receivables vs Liabilities) upon disbursement release and payroll deduction runs.' },
  { name: 'Alerts & Messages', key: 'Notification MQ', action: 'Broadcasts multi-channel alerts (SMS, Email, Push) triggered by engine status actions.' },
  { name: 'Document Vault', key: 'AWS S3 / Vault API', action: 'Stores encrypted copies of identity proofs, bank credentials, and digital agreements with secure temporary links.' }
]

const integrationColumns = [
  { accessorKey: 'name', header: 'HRIS Core Module' },
  { accessorKey: 'key', header: 'Channel Connection' },
  { accessorKey: 'action', header: 'Functional Sync Action' }
]

const architectureLayers = [
  { name: 'Presentation Layer', desc: 'Nuxt 3, Vue 3, Nuxt UI. Responsible for rendering the interactive dashboard, wizards, and real-time state visualization.', icon: 'i-lucide-layout', color: 'blue' },
  { name: 'Application Logic', desc: 'Pinia Stores & Vue Composables. Manages client state, RBAC (Role-Based Access Control) authentication, and orchestrates domain actions.', icon: 'i-lucide-cpu', color: 'emerald' },
  { name: 'Domain Services', desc: 'Core business rules. Contains the Financial Engine (amortization math) and Lifecycle orchestrator (state transitions).', icon: 'i-lucide-briefcase', color: 'amber' },
  { name: 'Persistence Mock', desc: 'Nitro Fake Backend & Local Storage. Simulates asynchronous REST API delays, database queries, and data immutability.', icon: 'i-lucide-database', color: 'purple' }
]

const dataModels = [
  { entity: 'User', fields: ['id', 'name', 'email', 'role', 'status', 'baseSalary', 'hireDate'], relation: 'Core Account Profile' },
  { entity: 'LoanType', fields: ['id', 'name', 'maxAmount', 'interestRate', 'interestMethod', 'minTenureMonths', 'isActive'], relation: '1:N with Applications' },
  { entity: 'LoanApplication', fields: ['id', 'loanRef', 'employeeId', 'loanTypeId', 'requestedAmount', 'status', 'applicationDate', 'termMonths'], relation: 'Core Aggregate Root' },
  { entity: 'RepaymentSchedule', fields: ['id', 'loanApplicationId', 'installmentNumber', 'dueDate', 'principalAmount', 'interestAmount', 'status'], relation: 'N:1 with Application' },
  { entity: 'PayrollDeduction', fields: ['id', 'loanId', 'amount', 'payrollDate', 'status'], relation: 'Integration with Payroll' },
  { entity: 'ApprovalStep', fields: ['id', 'applicationId', 'role', 'status', 'actionDate', 'remarks'], relation: 'Workflow Engine State' },
  { entity: 'LoanTransaction', fields: ['id', 'loanApplicationId', 'type', 'amount', 'transactionDate', 'reference'], relation: 'Ledger Audit Trail' },
  { entity: 'LoanDocument', fields: ['id', 'loanApplicationId', 'documentName', 'documentType', 'filePath'], relation: 'Storage Metadata' },
  { entity: 'EligibilityRule', fields: ['id', 'loanTypeId', 'ruleType', 'operator', 'value'], relation: 'Policy Configuration' },
  { entity: 'AppLog', fields: ['id', 'message', 'state', 'level', 'timestamp'], relation: 'System Activity (Immutable)' }
]

const personas = [
  {
    role: 'Employees',
    icon: 'i-lucide-user',
    color: 'blue',
    label: 'Self-Service',
    tasks: [
      'Apply for loans & check eligibility',
      'Monitor active amortization',
      'Download payment statements'
    ]
  },
  {
    role: 'HR Administrators',
    icon: 'i-lucide-settings',
    color: 'emerald',
    label: 'Policy Owner',
    tasks: [
      'Configure loan programs & policies',
      'Manage employee profiles',
      'Oversee approval workflows'
    ]
  },
  {
    role: 'Payroll Officers',
    icon: 'i-lucide-wallet',
    color: 'orange',
    label: 'Executioner',
    tasks: [
      'Trigger deduction cycles',
      'Manage hold/skip requests',
      'Post payments to pay runs'
    ]
  },
  {
    role: 'Finance Team',
    icon: 'i-lucide-activity',
    color: 'purple',
    label: 'Auditor',
    tasks: [
      'Audit balance sheets',
      'Release disbursal funds',
      'Generate ledger reports'
    ]
  },
  {
    role: 'Approvers (Supervisors)',
    icon: 'i-lucide-check-square',
    color: 'pink',
    label: 'Gatekeeper',
    tasks: [
      'Review request justifications',
      'Approve/reject entries',
      'Track team requests'
    ]
  }
] as any
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
                    Platform <span class="text-primary-600 dark:text-primary-400">Documentation</span>
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
                Platform <span class="text-primary-600 dark:text-primary-400">Documentation</span>
            </h1>
            <div class="flex items-center gap-3">
                <UColorModeButton color="primary" class="cursor-pointer hover:scale-105 transition-transform" />
            </div>
        </UContainer>
    </div>

    <!-- ── Manual Content ─────────────────────────────────────────────────── -->
    <UContainer class="py-12">
        <UTabs :items="items" orientation="vertical" variant="link" class="w-full" :ui="{ root: 'items-start sm:gap-6 md:gap-12', list: 'gap-1 sticky top-20 h-fit' }">
            
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
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                              <UCard variant="soft" v-for="(item, idx) in [
                                    'Digitize loan application & approval',
                                    'Automate salary deductions',
                                    'Monitor balances in real time',
                                    'Reduce manual HR processing',
                                    'Provide structured employee loan programs',
                                    'Improve financial transparency'
                                ]" :key="idx" :ui="{ body: 'flex gap-2' }">
                                    <UIcon name="i-lucide-check-circle" class="size-5 text-primary-500 shrink-0" />
                                    <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ item }}</span>
                              </UCard>
                            </div>
                        </div>

                        <!-- Business Value Stats -->
                        <UCard variant="subtle" :ui="{ body: 'flex flex-col gap-6' }" class="bg-primary/5 dark:bg-primary-950/20 ring-primary-200 dark:ring-primary-800/50 rounded-2xl h-fit">
                            <h3 class="font-bold leading-none flex items-center gap-2">
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
                            <UCard v-for="(persona, pIdx) in personas" :key="pIdx" variant="subtle" class="shadow-sm transition-colors" :class="`hover:border-${persona.color}-500/30`">
                                <div class="p-2.5 rounded-xl w-fit mb-4" :class="`bg-${persona.color}-500/10 text-${persona.color}-500`">
                                    <UIcon :name="persona.icon" class="size-6 shrink-0 flex" />
                                </div>
                                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">{{ persona.role }}</h3>
                                <ul class="text-sm text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4 mb-4">
                                    <li v-for="(task, tIdx) in persona.tasks" :key="tIdx">{{ task }}</li>
                                </ul>
                                <UBadge :color="persona.color" variant="subtle" size="sm" :label="persona.label" />
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
                            <div class="absolute -top-24 -right-24 size-60 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-3xl" :class="`bg-${mod.color}-500`" />
                            
                            <!-- Header -->
                            <div class="flex items-start gap-3">
                                <div class="p-2 rounded-xl shrink-0" :class="`bg-${mod.color}-500/10 text-${mod.color}-500`">
                                    <UIcon :name="mod.icon" class="size-6 shrink-0 flex" />
                                </div>
                                <!-- <h3 class="font-bold text-lg text-neutral-900 dark:text-white mt-1 group-hover:text-primary transition-colors">
                                    {{ mod.id }}. {{ mod.title }}
                                </h3> -->
                                <h3 class="font-bold text-lg mt-1 transition-colors" :class="`group-hover:text-${mod.color}-500`">
                                    {{ mod.title }}
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
                                    <div v-for="ch in mod.channels" :key="ch.name" class="flex flex-col gap-2 bg-white dark:bg-neutral-900 p-2 rounded-lg border border-default shadow-sm">
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
                <div class="space-y-12 animate-fade-in w-full">
                    
                  <div class="space-y-6">
                    <!-- Interactive Employee Journey -->
                      <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                        <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                            <UIcon name="i-lucide-activity" class="size-6 text-primary" />
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">End-to-End Employee Journey</h2>
                            <p class="text-sm text-neutral-500">How an employee moves through the lifecycle of a loan program.</p>
                        </div>
                      </div>
                        <!-- Vertical Timeline Layout -->
                        <div class="relative pl-10 space-y-5 before:absolute before:left-[15px] before:top-6 before:bottom-16 before:w-[2px] before:bg-gradient-to-b before:from-primary-500/60 before:via-primary-300/40 before:to-primary-500/10 before:rounded-full">
                            <div v-for="(step, sIdx) in employeeJourney" :key="sIdx" class="relative group">
                                <!-- Outer glow ring -->
                                <div class="absolute left-[-40px] top-[17px] size-8 rounded-full bg-primary-500/10 group-hover:bg-primary-500/20 group-hover:scale-125 transition-all duration-300" />
                                <!-- Indicator Bubble -->
                                <span class="absolute left-[-35px] top-[22px] size-[22px] rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-primary-500/30 group-hover:shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300 ring-2 ring-white dark:ring-neutral-800 z-10">
                                    {{ sIdx + 1 }}
                                </span>
                                <UCard variant="subtle" class="w-full group-hover:border-primary-500/30 group-hover:shadow-md group-hover:shadow-primary-500/5 transition-all duration-300">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h3 class="font-bold group-hover:text-primary transition-colors duration-200">{{ step.title }}</h3>
                                        <UBadge :label="`Step ${sIdx + 1}`" variant="soft" class="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    </div>
                                    <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{{ step.desc }}</p>
                                </UCard>
                            </div>
                        </div>
                  </div>

                  <div class="space-y-6">
                    <!-- Integration Matrix -->
                        <div class="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                                <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                                    <UIcon name="i-lucide-git-commit" class="size-6 text-primary" />
                                </div>
                                <div>
                                    <div>HRIS Integration Ecosystem</div>
                                    <div class="text-sm text-neutral-500 font-normal">Secure channels linking the loan processor with surrounding HR software.</div>
                                </div>
                            </h2>
                        </div>

                        <UTable :data="integrations" :columns="integrationColumns" class="w-full ring ring-default rounded-xl shadow-sm overflow-hidden">
                            <template #name-cell="{ row }">
                                <span class="font-bold text-default whitespace-nowrap">{{ row.original.name }}</span>
                            </template>
                            <template #key-cell="{ row }">
                                <UBadge variant="soft" class="font-mono whitespace-nowrap">{{ row.original.key }}</UBadge>
                            </template>
                            <template #action-cell="{ row }">
                                <div class="leading-relaxed text-xs whitespace-normal break-words">
                                    {{ row.original.action }}
                                </div>
                            </template>
                        </UTable>
                      </div>
                  </div>
            </template>

            <!-- ARCHITECTURE & DATA -->
            <template #technical>
                <div class="space-y-12 animate-fade-in w-full">
                    
                    <!-- System Architecture Stack -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                                <UIcon name="i-lucide-layers" class="size-6 text-primary" />
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">System Architecture Stack</h2>
                                <p class="text-sm text-neutral-500">The 4-tier design pattern separating UI concerns from core business logic.</p>
                            </div>
                        </div>

                        <div class="flex flex-col gap-4">
                            <UCard v-for="(layer, lIdx) in architectureLayers" :key="lIdx" variant="subtle" class="group transition-transform duration-300 shadow-sm relative overflow-hidden">
                                <div class="flex items-center gap-4">
                                    <div class="p-3 rounded-xl bg-gradient-to-b" :class="`from-${layer.color}-400 to-${layer.color}-600`">
                                        <UIcon :name="layer.icon" class="size-6 shrink-0 flex text-white" />
                                    </div>
                                    <div class="flex-1">
                                        <h3 class="font-bold text-lg">{{ layer.name }}</h3>
                                        <p class="text-sm text-muted">{{ layer.desc }}</p>
                                    </div>
                                </div>
                            </UCard>
                        </div>
                    </div>

                    <!-- Core Data Entities -->
                    <div class="space-y-6">
                        <div class="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                                <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                                    <UIcon name="i-lucide-database" class="size-6 text-primary" />
                                </div>
                                <div>
                                    <div>Core Data Entities</div>
                                    <div class="text-sm text-neutral-500 font-normal">The relational structure powering the internal state machine.</div>
                                </div>
                            </h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <UCard v-for="model in dataModels" :key="model.entity" :ui="{ root: 'flex flex-col', header: 'bg-muted flex items-center justify-between w-full', body: 'flex-1', footer: 'bg-muted font-mono text-center text-xs' }" class="shadow-sm">
                            <template #header>
                              <span class="font-mono font-bold text-sm text-neutral-900 dark:text-white group-hover:text-primary transition-colors">{{ model.entity }}</span>
                                    <UIcon name="i-lucide-braces" class="text-neutral-400 size-4" />
                            </template>
                                    <span class="text-xs font-dimmed uppercase tracking-wider block mb-2">Schema Fields</span>
                                    <div class="flex flex-wrap gap-1.5 mb-4">
                                      <UBadge v-for="field in model.fields" :key="field" variant="subtle" color="neutral" class="font-mono">{{ field }}</UBadge>
                                    </div>
                              <template #footer>
                                {{ model.relation }}
                              </template>
                          </UCard>
                        </div>
                    </div>

                </div>
            </template>

            <!-- DESIGN SYSTEM -->
            <template #design>
                <div class="space-y-12 animate-fade-in w-full">
                    
                    <!-- Colors -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                                <UIcon name="i-lucide-palette" class="size-6 text-primary" />
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Color Palette</h2>
                                <p class="text-sm text-neutral-500">Semantic colors used throughout the application.</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <UCard variant="subtle" :ui="{ root: 'divide-y-0', header: 'p-0 sm:p-0' }" class="shadow-sm">
                                <template #header>
                                    <div class="h-20 bg-primary-500 w-full"></div>
                                </template>
                                <h3 class="font-bold">Primary</h3>
                                <p class="text-xs text-muted mt-1">Main brand color, interactive elements, primary buttons.</p>
                            </UCard>
                            <UCard variant="subtle" :ui="{ root: 'divide-y-0', header: 'p-0 sm:p-0' }" class="shadow-sm">
                                <template #header>
                                    <div class="h-20 bg-success-500 w-full"></div>
                                </template>
                                <h3 class="font-bold">Success</h3>
                                <p class="text-xs text-muted mt-1">Active states, approved loans, successful actions.</p>
                            </UCard>
                            <UCard variant="subtle" :ui="{ root: 'divide-y-0', header: 'p-0 sm:p-0' }" class="shadow-sm">
                                <template #header>
                                    <div class="h-20 bg-warning-500 w-full"></div>
                                </template>
                                <h3 class="font-bold">Warning</h3>
                                <p class="text-xs text-muted mt-1">Pending states, alerts, required access warnings.</p>
                            </UCard>
                            <UCard variant="subtle" :ui="{ root: 'divide-y-0', header: 'p-0 sm:p-0' }" class="shadow-sm">
                                <template #header>
                                    <div class="h-20 bg-error-500 w-full"></div>
                                </template>
                                <h3 class="font-bold">Error</h3>
                                <p class="text-xs text-muted mt-1">Rejected loans, destructive actions, critical errors.</p>
                            </UCard>
                        </div>
                    </div>

                    <!-- Typography -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                                <UIcon name="i-lucide-type" class="size-6 text-primary" />
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Typography</h2>
                                <p class="text-sm text-neutral-500">Fonts used for the user interface.</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UCard variant="subtle">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="font-bold">Geist Sans</h3>
                                    <UBadge variant="subtle" color="neutral">Sans-serif</UBadge>
                                </div>
                                <p class="text-2xl font-sans text-neutral-900 dark:text-white mb-2">The quick brown fox jumps over the lazy dog</p>
                                <p class="text-sm text-muted">Used for all general UI elements, headings, and paragraph text.</p>
                            </UCard>
                            <UCard variant="subtle">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="font-bold">Geist Mono</h3>
                                    <UBadge variant="subtle" color="neutral">Monospace</UBadge>
                                </div>
                                <p class="text-lg font-mono text-neutral-900 dark:text-white mb-2">import { useLoanStore } from '~/stores'</p>
                                <p class="text-sm text-muted">Used for code snippets, database IDs, and technical data.</p>
                            </UCard>
                        </div>
                    </div>

                    <!-- Components -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                                <UIcon name="i-lucide-component" class="size-6 text-primary" />
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Core UI Components</h2>
                                <p class="text-sm text-neutral-500">Powered by Nuxt UI v3.</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <UCard variant="subtle">
                                <h3 class="font-bold mb-4">Buttons (UButton)</h3>
                                <div class="flex flex-wrap gap-2 mb-2">
                                    <UButton color="primary">Primary</UButton>
                                    <UButton color="neutral" variant="soft">Neutral</UButton>
                                    <UButton color="error" variant="outline">Error</UButton>
                                </div>
                                <p class="text-xs text-muted mt-4">Used for primary actions, secondary actions, and destructive intents.</p>
                            </UCard>

                            <UCard variant="subtle">
                                <h3 class="font-bold mb-4">Badges (UBadge)</h3>
                                <div class="flex flex-wrap gap-2 mb-2">
                                    <UBadge color="success" variant="subtle">Approved</UBadge>
                                    <UBadge color="warning" variant="subtle">Pending</UBadge>
                                    <UBadge color="error" variant="subtle">Rejected</UBadge>
                                </div>
                                <p class="text-xs text-muted mt-4">Used for status indicators and labeling system entities.</p>
                            </UCard>

                            <UCard variant="subtle">
                                <h3 class="font-bold mb-4">Cards & Layouts</h3>
                                <div class="space-y-2">
                                    <div class="w-full bg-neutral-100 dark:bg-neutral-800 p-2 rounded text-center text-xs text-muted border border-neutral-200 dark:border-neutral-700">UCard</div>
                                    <div class="w-full bg-neutral-100 dark:bg-neutral-800 p-2 rounded text-center text-xs text-muted border border-neutral-200 dark:border-neutral-700">UPageCard</div>
                                </div>
                                <p class="text-xs text-muted mt-4">Used to encapsulate data models and page headers.</p>
                            </UCard>
                        </div>
                    </div>
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

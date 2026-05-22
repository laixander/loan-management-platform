<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({
    layout: false,
    title: 'Documentation'
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

// Active Section State
const activeTab = ref('overview')

// UI Checklist Tree Interface
interface UiTreeNode {
  name: string
  type: string
  desc: string
  icon?: string
  children?: UiTreeNode[]
}

// Tree Data for the Loan Management Platform UI
const uiTree: UiTreeNode[] = [
  {
    name: 'Employee Self-Service Portal (/employee/loans)',
    type: 'Page',
    desc: 'Self-service home portal for employees to review active balances, access payment ledgers, and initiate applications.',
    icon: 'i-lucide-user',
    children: [
      {
        name: 'Dashboard Widget Summary',
        type: 'Subpage Component',
        desc: 'Compact landing panel integrated directly into the employee home dashboard. Showcases active balance summaries, next repayment date, deduction counts, and quick-action links.'
      },
      {
        name: 'Active Loans Repayment Ledger',
        type: 'Subpage Component',
        desc: 'Comprehensive grid showing detailed amortization logs, itemized principal vs interest payments, and statements export features.',
        children: [
          {
            name: 'Early Settlement & Restructure Calculator',
            type: 'Overlay Modal',
            desc: 'Interactive dialog modal to simulate early repayment payoff balances, penalty waivers, or term restructures.'
          }
        ]
      },
      {
        name: 'Loan Application Multi-Step Wizard',
        type: 'Overlay Drawer',
        desc: 'Slide-out multi-step drawer panel guiding the employee through calculations, eligibility validations, and formal requests.',
        children: [
          {
            name: 'Real-time Amortization repayment simulator',
            type: 'Form & Chart component',
            desc: 'Includes term sliders and principal dials updating collection schedules and net-take-home indicators live.'
          },
          {
            name: 'HR Employee Profile Verify Panel',
            type: 'Subpage Component',
            desc: 'Auto-completes and displays official employment parameters: tenure, salary grade, and active limits.'
          },
          {
            name: 'Document Upload Dropzone',
            type: 'Form component',
            desc: 'Drag-and-drop secure file upload supporting calamity proof, bank statements, or official identity papers.'
          },
          {
            name: 'Digital Signature Agreement Panel',
            type: 'Form component',
            desc: 'Canvas signing board capturing employee authentication initials and binding rules compliance seals.'
          }
        ]
      }
    ]
  },
  {
    name: 'HR Admin Policy Configuration (/admin/loans/policies)',
    type: 'Page',
    desc: 'Global configurations suite enabling HR to construct loan catalogs, interest rates, and multi-tier workflow routing rules.',
    icon: 'i-lucide-settings-2',
    children: [
      {
        name: 'Loan Programs Directory Board',
        type: 'Subpage Component',
        desc: 'Catalog list displaying active salary, emergency, calamity, and custom loans with status toggles and core statistics.'
      },
      {
        name: 'Create/Edit Program Configuration Drawer',
        type: 'Overlay Drawer',
        desc: 'Slide-over sidebar to configure custom interest models, amortization plans, tenure brackets, and required checklist configurations.'
      },
      {
        name: 'Multi-Level Approval Flow Designer',
        type: 'Subpage Component',
        desc: 'Visual node dashboard detailing sequential or parallel routing chains matching custom criteria (e.g. loan size).'
      },
      {
        name: 'Workflow Node Details Configuration Modal',
        type: 'Overlay Modal',
        desc: 'Set conditions, auto-escalation windows, temporary delegations, and specific email alert presets per approval stage.'
      }
    ]
  },
  {
    name: 'Payroll Synchronization Hub (/payroll/loans/sync)',
    type: 'Page',
    desc: 'Bi-directional payroll engine enabling cutoff calculations, pay run syncing, skip orders, and manual balancing.',
    icon: 'i-lucide-wallet',
    children: [
      {
        name: 'Deduction Run Queue Dashboard',
        type: 'Subpage Component',
        desc: 'Core payroll list showing active pay run cutoffs, deduction schedules, extract progress, and manual synchronizations.'
      },
      {
        name: 'Skip/Hold Pay Cycle Modal',
        type: 'Overlay Modal',
        desc: 'Authorizes payroll officers to delay deduction schedules or freeze individual repayments due to extraordinary HR conditions.'
      },
      {
        name: 'Adjustment Ledger Dashboard',
        type: 'Subpage Component',
        desc: 'Table displaying offline cash repayments, error corrections, and CSV batch uploads to manually clear open debts.'
      }
    ]
  },
  {
    name: 'HR Admin General Ledger Board (/admin/loans/ledger)',
    type: 'Page',
    desc: 'Auditable transaction board illustrating active balances, cash receivables, wire disbursals, and compliance exports.',
    icon: 'i-lucide-trending-up',
    children: [
      {
        name: 'Active Loan Audit List Grid',
        type: 'Subpage Component',
        desc: 'Searchable grid tracking all released employee loans, active principal balances, current cycles, and late alert indicators.'
      },
      {
        name: 'Disbursal Wire Release Desk',
        type: 'Subpage Component',
        desc: 'Aggregates fully approved loan requests waiting for wire dispersal files or direct bank integrations.'
      },
      {
        name: 'Disbursal Reference Verification Dialog',
        type: 'Overlay Modal',
        desc: 'Confirms disbursement status, matches transaction reference codes, and uploads official payment confirmation receipts.'
      }
    ]
  },
  {
    name: 'Manager Approval Workspace (/approvals/loans)',
    type: 'Page',
    desc: 'Central inbox for department supervisors, HR leads, and directors to review and action pending loan applications.',
    icon: 'i-lucide-check-square',
    children: [
      {
        name: 'Pending Approvals Table Board',
        type: 'Subpage Component',
        desc: 'Consolidated view of requested loan amounts, employee records, and urgency counters.'
      },
      {
        name: 'Detailed Request Review Overlay',
        type: 'Overlay Modal',
        desc: 'Complete overview panel combining historical employee loan usage, comment threads, debt-to-income checks, and Approve/Reject controls.'
      }
    ]
  }
]

// Expanded tree nodes
const expandedNodes = ref<string[]>([
  'Employee Self-Service Portal (/employee/loans)',
  'HR Admin Policy Configuration (/admin/loans/policies)',
  'Manager Approval Workspace (/approvals/loans)'
])

// Tree search input
const treeSearchQuery = ref('')

const toggleNode = (nodeName: string) => {
  if (expandedNodes.value.includes(nodeName)) {
    expandedNodes.value = expandedNodes.value.filter(name => name !== nodeName)
  } else {
    expandedNodes.value.push(nodeName)
  }
}

const expandAll = () => {
  const allNames: string[] = []
  const visit = (node: UiTreeNode) => {
    allNames.push(node.name)
    if (node.children) {
      node.children.forEach(visit)
    }
  }
  uiTree.forEach(visit)
  expandedNodes.value = allNames
}

const collapseAll = () => {
  expandedNodes.value = []
}

// Filters tree nodes matching search keyword recursively
const filterTree = (nodes: UiTreeNode[]): UiTreeNode[] => {
  return nodes.map(node => {
    const matchesSearch = node.name.toLowerCase().includes(treeSearchQuery.value.toLowerCase()) ||
                          node.type.toLowerCase().includes(treeSearchQuery.value.toLowerCase()) ||
                          node.desc.toLowerCase().includes(treeSearchQuery.value.toLowerCase())
    
    let filteredChildren: UiTreeNode[] = []
    if (node.children) {
      filteredChildren = filterTree(node.children)
    }
    
    if (matchesSearch || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren
      } as UiTreeNode
    }
    return null
  }).filter(Boolean) as UiTreeNode[]
}

const filteredUiTree = computed(() => {
  if (!treeSearchQuery.value) return uiTree
  return filterTree(uiTree)
})


// Navigation tabs definition
const tabs = [
  { id: 'overview', label: 'Overview & Users', icon: 'i-lucide-book-open' },
  { id: 'modules', label: 'Functional Modules', icon: 'i-lucide-layers' },
  { id: 'workflows', label: 'Flows & Integrations', icon: 'i-lucide-git-commit' },
  { id: 'technical', label: 'Architecture & Data', icon: 'i-lucide-cpu' },
  { id: 'uichecklist', label: 'UI Checklist & Walkthrough', icon: 'i-lucide-palette' }
]

// Interactive UI walkthrough step state
const activeUxStep = ref(1)

const uxSteps = [
  {
    step: 1,
    title: 'Employee Dashboard & Live Calculator',
    desc: 'The self-service gateway for the employee. Includes interactive slider inputs to simulate loan interest and amortization schedules in real-time, verifying payroll compliance before submitting.',
    views: ['Live amortization repayment charts', 'Eligible credit limit banners', 'Net-take-home pay warning indicators'],
    action: 'Adjusts term slider and loan volume size',
    icon: 'i-lucide-calculator'
  },
  {
    step: 2,
    title: 'Multi-Step Application Wizard Drawer',
    desc: 'A structured slide-over overlay panel guiding the employee through pre-filled profile information, target bank details, dynamic document checklists, and digital contract signatures.',
    views: ['Drag-and-drop file upload dropzone', 'Auto-completed HR employee records', 'Document type validation states'],
    action: 'Attaches files and submits application to routing queue',
    icon: 'i-lucide-file-text'
  },
  {
    step: 3,
    title: 'Manager Approval & Feedback Overlay',
    desc: 'An overlay modal dedicated to managers and HR officers displaying the application context, comments history log, outstanding employee debts, and validation decisions.',
    views: ['Inline comment and justification inputs', 'Turnaround time tracker timers', 'Approve, Reject, or Return to Employee buttons'],
    action: 'Appends rationale comments and clicks Approve',
    icon: 'i-lucide-check-square'
  },
  {
    step: 4,
    title: 'Administrative Ledger & Payroll Board',
    desc: 'The corporate board showing active loan schedules, monthly collection charts, cutoff-based skip/hold triggers, and outstanding liability logs.',
    views: ['Amortization stacked principal vs interest charts', 'Pay run sync indicators', 'Manual bank settlement drawer'],
    action: 'Monitors deduction records and runs financial audits',
    icon: 'i-lucide-trending-up'
  }
]

const activeStepData = computed(() => {
  return uxSteps[activeUxStep.value - 1] || uxSteps[0]
})

// Database / Data Entity State
const selectedEntity = ref('Employee')

const entities = [
  { 
    name: 'Employee', 
    desc: 'Core profile details, employment status, tenure, and payroll eligibility criteria.', 
    fields: ['id (UUID)', 'first_name (String)', 'last_name (String)', 'department_id (UUID)', 'tenure_months (Int)', 'salary_amount (Decimal)', 'employment_status (Enum)'] 
  },
  { 
    name: 'LoanApplication', 
    desc: 'Submitted loan request detailing terms, interest rates, uploaded files, and state of approval.', 
    fields: ['id (UUID)', 'employee_id (UUID)', 'loan_type_id (UUID)', 'requested_amount (Decimal)', 'tenure_months (Int)', 'status (Enum)', 'submitted_at (DateTime)'] 
  },
  { 
    name: 'LoanType', 
    desc: 'Configured loan programs (e.g., Salary, Calamity, Emergency) defining rules and financial constraints.', 
    fields: ['id (UUID)', 'name (String)', 'max_amount (Decimal)', 'interest_rate (Decimal)', 'repayment_period_months (Int)', 'required_documents (Array)', 'is_active (Boolean)'] 
  },
  { 
    name: 'RepaymentSchedule', 
    desc: 'Amortization schedule detailing payment dates, expected principal, interest, and tracking state.', 
    fields: ['id (UUID)', 'loan_application_id (UUID)', 'due_date (Date)', 'amount_due (Decimal)', 'principal_portion (Decimal)', 'interest_portion (Decimal)', 'status (Enum)'] 
  },
  { 
    name: 'PayrollDeduction', 
    desc: 'Actual deductions executed during payroll cutoff runs, linked back to the repayment schedule.', 
    fields: ['id (UUID)', 'repayment_schedule_id (UUID)', 'payroll_run_id (UUID)', 'deducted_amount (Decimal)', 'processed_at (DateTime)', 'status (Enum)'] 
  },
  { 
    name: 'LoanApproval', 
    desc: 'Immutable audit trail of workflow approvals, approval level, conditions, and feedback.', 
    fields: ['id (UUID)', 'loan_application_id (UUID)', 'approver_id (UUID)', 'approval_level (Int)', 'status (Enum)', 'comments (Text)', 'actioned_at (DateTime)'] 
  },
  { 
    name: 'LoanLedger', 
    desc: 'Central ledger recording absolute financial health of a loan: paid principal, interest, and adjustments.', 
    fields: ['id (UUID)', 'loan_application_id (UUID)', 'total_disbursed (Decimal)', 'total_paid_principal (Decimal)', 'total_paid_interest (Decimal)', 'outstanding_balance (Decimal)', 'last_payment_date (Date)'] 
  },
  { 
    name: 'LoanDocument', 
    desc: 'Metadata and secure reference links for attachments, identity proofs, or signed digital agreements.', 
    fields: ['id (UUID)', 'loan_application_id (UUID)', 'document_type (String)', 'file_name (String)', 'file_url (String)', 'uploaded_at (DateTime)'] 
  }
]

// Modules Definition
const modules = [
  {
    id: 1,
    title: 'Loan Type Management',
    icon: 'i-lucide-settings-2',
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
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">

    <!-- ── Static Banner Header (Standard Flow) ─────────────────────── -->
    <div
      class="relative overflow-hidden py-16 sm:py-20 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-gradient-to-br from-primary-500/5 via-transparent to-emerald-500/5 transition-all duration-500 ease-in-out"
      :class="isScrolled ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'"
    >
      <!-- Glow Orbs -->
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <UContainer>
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 mb-4">
            <UIcon name="i-lucide-book-open" class="w-4 h-4" />
            <span>Developer Reference</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            Loan Management Platform <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-500">HRIS Submodule Docs</span>
          </h1>
          <p class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            A comprehensive, digital employee loan suite fully aligned with payroll runs, company policy parameters, approval limits, and multi-tier workflows.
          </p>
        </div>
      </UContainer>
    </div>

    <!-- ── Fixed Mini-Navbar (Slides in smoothly on scroll, zero layout shift) ── -->
    <div
      class="fixed top-0 left-0 right-0 z-40 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm transition-all duration-300 ease-in-out"
      :class="isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'"
    >
      <UContainer class="py-3 flex items-center justify-between">
        <h1 class="text-lg font-bold text-neutral-900 dark:text-white leading-none">
          Loan Management Platform
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-500"> Docs</span>
        </h1>
        <UColorModeButton color="primary" class="cursor-pointer hover:scale-105 transition-transform" />
      </UContainer>
    </div>

    <!-- Navigation Tabs -->
    <div 
      class="sticky z-30 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur border-b border-neutral-200/50 dark:border-neutral-800/50 transition-all duration-300"
      :class="isScrolled ? 'top-14' : 'top-0'"
    >
      <UContainer class="py-2">
        <div class="flex overflow-x-auto gap-2 py-1 scrollbar-none">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 cursor-pointer',
              activeTab === tab.id
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-500/20'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-transparent'
            ]"
          >
            <UIcon :name="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>
      </UContainer>
    </div>

    <!-- Content Sections -->
    <UContainer class="py-10">
      
      <!-- TAB 1: OVERVIEW & USERS -->
      <div v-if="activeTab === 'overview'" class="space-y-12 animate-fade-in">
        
        <!-- Core Purpose Card -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-focus" class="text-primary-500" />
              Core Purpose
            </h2>
            <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Managing employee financial assistance programmatically reduces HR overhead while empowering employees. The submodule automates calculations, limits manual entries, and integrates securely with pay schedules.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(item, idx) in [
                'Provide structured employee loan programs',
                'Digitize loan application and approval processes',
                'Automate salary deductions and schedules',
                'Monitor outstanding balances in real time',
                'Reduce manual HR and payroll processing',
                'Improve financial transparency for teams'
              ]" :key="idx" class="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
                <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Stats & Benefits -->
          <div class="p-6 rounded-2xl bg-gradient-to-b from-primary-500/5 to-emerald-500/5 border border-primary-500/10 space-y-6">
            <h3 class="font-bold text-lg text-neutral-900 dark:text-white">Business Value</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>HR PROCESSING EFFICIENCY</span>
                  <span class="text-primary-500">+85%</span>
                </div>
                <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 85%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>PAYROLL COMPUTATION ACCURACY</span>
                  <span class="text-primary-500">100%</span>
                </div>
                <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 100%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>DISBURSEMENT CYCLE TAT</span>
                  <span class="text-primary-500">-70%</span>
                </div>
                <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 70%"></div>
                </div>
              </div>
            </div>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 italic">
              *Projections based on automated integration mapping compared to physical workflow handling.
            </p>
          </div>
        </div>

        <!-- Primary Users Grid -->
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-lucide-users" class="text-primary-500" />
            Primary User Personas
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            
            <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col justify-between hover:border-primary-500/30 transition-all group">
              <div>
                <div class="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-user" class="w-6 h-6" />
                </div>
                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">Employees</h3>
                <ul class="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4">
                  <li>Apply for loans</li>
                  <li>Check eligibility & caps</li>
                  <li>Monitor amortization</li>
                  <li>Download statements</li>
                </ul>
              </div>
              <span class="inline-block mt-4 text-[10px] uppercase font-bold tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded w-fit">Self-Service</span>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col justify-between hover:border-primary-500/30 transition-all group">
              <div>
                <div class="p-2.5 rounded-xl bg-green-500/10 text-green-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-settings" class="w-6 h-6" />
                </div>
                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">HR Administrators</h3>
                <ul class="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4">
                  <li>Configure programs</li>
                  <li>Review rules & policies</li>
                  <li>Verify configurations</li>
                  <li>Manage workflows</li>
                </ul>
              </div>
              <span class="inline-block mt-4 text-[10px] uppercase font-bold tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded w-fit">Policy Owner</span>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col justify-between hover:border-primary-500/30 transition-all group">
              <div>
                <div class="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-coins" class="w-6 h-6" />
                </div>
                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">Payroll Officers</h3>
                <ul class="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4">
                  <li>Trigger deduction cycle</li>
                  <li>Manage holds/skips</li>
                  <li>Post payments to pay runs</li>
                  <li>Adjust payroll errors</li>
                </ul>
              </div>
              <span class="inline-block mt-4 text-[10px] uppercase font-bold tracking-wider text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded w-fit">Executioner</span>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col justify-between hover:border-primary-500/30 transition-all group">
              <div>
                <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-activity" class="w-6 h-6" />
                </div>
                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">Finance Team</h3>
                <ul class="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4">
                  <li>Audit balance sheets</li>
                  <li>Track cash receivables</li>
                  <li>Reconcile wire transfers</li>
                  <li>Generate ledger reports</li>
                </ul>
              </div>
              <span class="inline-block mt-4 text-[10px] uppercase font-bold tracking-wider text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded w-fit">Auditor</span>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col justify-between hover:border-primary-500/30 transition-all group">
              <div>
                <div class="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-thumbs-up" class="w-6 h-6" />
                </div>
                <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">Approvers</h3>
                <ul class="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 list-disc pl-4">
                  <li>Review request details</li>
                  <li>Add custom conditions</li>
                  <li>Approve/reject entries</li>
                  <li>Track team requests</li>
                </ul>
              </div>
              <span class="inline-block mt-4 text-[10px] uppercase font-bold tracking-wider text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded w-fit">Gatekeeper</span>
            </div>

          </div>
        </div>

      </div>

      <!-- TAB 2: FUNCTIONAL MODULES -->
      <div v-if="activeTab === 'modules'" class="space-y-8 animate-fade-in">
        <div class="max-w-3xl mb-4">
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-lucide-layers" class="text-primary-500" />
            Core Submodule Modules
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 mt-2">
            A modular approach containing 9 independent, loosely-coupled engines processing distinct segments of the loan lifespan.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="mod in modules" 
            :key="mod.id" 
            class="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 relative overflow-hidden group"
          >
            <!-- Design corner glow -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-bl-full group-hover:bg-primary-500/10 transition-colors" />

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-xl bg-primary-500/10 text-primary-500 shrink-0">
                  <UIcon :name="mod.icon" class="w-6 h-6" />
                </div>
                <h3 class="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  {{ mod.id }}. {{ mod.title }}
                </h3>
              </div>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {{ mod.desc }}
              </p>

              <!-- Conditionally render items details -->
              <div v-if="mod.features" class="space-y-1.5 pt-2">
                <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider">Key Capabilities</span>
                <div v-for="(feat, fIdx) in mod.features" :key="fIdx" class="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{{ feat }}</span>
                </div>
              </div>

              <!-- Examples -->
              <div v-if="mod.examples" class="pt-2">
                <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider mb-1.5">Standard Types</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="ex in mod.examples" :key="ex" class="text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded border border-neutral-200/50 dark:border-neutral-700/50">{{ ex }}</span>
                </div>
              </div>

              <!-- Validation -->
              <div v-if="mod.validations" class="pt-2">
                <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider mb-1.5 text-orange-500">Validation Checks</span>
                <div class="grid grid-cols-2 gap-1.5">
                  <div v-for="val in mod.validations" :key="val" class="flex items-center gap-1 text-[11px] text-neutral-600 dark:text-neutral-300 bg-orange-500/5 px-2 py-1 rounded border border-orange-500/10">
                    <UIcon name="i-lucide-alert-circle" class="w-3 h-3 text-orange-500" />
                    <span class="truncate">{{ val }}</span>
                  </div>
                </div>
              </div>

              <!-- Flow details -->
              <div v-if="mod.flow" class="pt-2">
                <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider mb-1.5">Routing Flow</span>
                <p class="text-[11px] font-mono text-primary-600 dark:text-primary-400 bg-neutral-50 dark:bg-neutral-950 p-2 rounded border border-neutral-200/50 dark:border-neutral-800/50">
                  {{ mod.flow }}
                </p>
              </div>

              <!-- Models -->
              <div v-if="mod.models" class="pt-2">
                <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider mb-1.5">Interest Frameworks</span>
                <div class="grid grid-cols-2 gap-1">
                  <span v-for="m in mod.models" :key="m" class="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-1.5 rounded truncate border border-neutral-200/50 dark:border-neutral-700/50" :title="m">{{ m }}</span>
                </div>
              </div>

              <!-- Channels -->
              <div v-if="mod.channels" class="pt-2 space-y-2">
                <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider">Available Outlets</span>
                <div v-for="ch in mod.channels" :key="ch.name" class="flex items-start gap-2 bg-neutral-50 dark:bg-neutral-950 p-1.5 rounded border border-neutral-200/50 dark:border-neutral-800/50">
                  <div class="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">{{ ch.name }}:</div>
                  <div class="text-[10px] text-neutral-500 dark:text-neutral-400">{{ ch.desc }}</div>
                </div>
              </div>

              <!-- Metrics -->
              <div v-if="mod.metrics" class="pt-2 grid grid-cols-2 gap-2">
                <div v-for="met in mod.metrics" :key="met.label" class="p-2 bg-neutral-50 dark:bg-neutral-950 rounded border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col justify-between">
                  <span class="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 block truncate">{{ met.label }}</span>
                  <span class="text-[9px] text-neutral-500 dark:text-neutral-400 block mt-1 line-clamp-2 leading-snug">{{ met.val }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: WORKFLOWS & INTEGRATIONS -->
      <div v-if="activeTab === 'workflows'" class="space-y-12 animate-fade-in">
        
        <!-- Interactive Employee Journey -->
        <div class="space-y-6">
          <div class="max-w-2xl">
            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-activity" class="text-primary-500" />
              End-to-End Employee Journey
            </h2>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              How an employee moves through the lifecycle of a loan program from selection to absolute ledger settlement.
            </p>
          </div>

          <!-- Vertical Timeline Layout -->
          <div class="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
            <div 
              v-for="(step, sIdx) in [
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
              ]"
              :key="sIdx"
              class="relative group"
            >
              <!-- Indicator Bubble -->
              <span class="absolute left-[-29px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-950 border-2 border-primary-500 text-primary-500 text-[10px] font-bold flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                {{ sIdx + 1 }}
              </span>
              <div class="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm group-hover:border-primary-500/30 transition-all max-w-3xl">
                <h3 class="font-bold text-sm text-neutral-900 dark:text-white">{{ step.title }}</h3>
                <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Integration Matrix -->
        <div class="space-y-6">
          <div class="max-w-2xl">
            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-git-commit" class="text-primary-500" />
              HRIS Integration Ecosystem
            </h2>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Secure channels linking the loan processor with surrounding HR and enterprise software.
            </p>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm bg-white dark:bg-neutral-900">
            <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
              <thead class="bg-neutral-50 dark:bg-neutral-950">
                <tr>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">HRIS Core Module</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">Channel Connection</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Functional Sync Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
                <tr v-for="(intg, idx) in [
                  { name: 'Employee Profiles', key: 'Profiles REST', action: 'Syncs core employment status, hiring anniversary data, and department structures for initial eligibility checks.' },
                  { name: 'Payroll Engine', key: 'Payroll Cutoff MQ', action: 'Queues active loan amortization schedules for extraction into dynamic payslip deduction blocks during pay runs.' },
                  { name: 'Attendance & Leave', key: 'Compensation REST', action: 'Fetches paid suspension records, leave status, and general hours to determine net-take-home eligibility.' },
                  { name: 'Accounting / ERP', key: 'General Ledger API', action: 'Triggers journal ledger adjustments (Receivables vs Liabilities) upon disbursement release and payroll deduction runs.' },
                  { name: 'Alerts & Messages', key: 'Notification MQ', action: 'Broadcasts multi-channel alerts (SMS, Email, Push) triggered by engine status actions.' },
                  { name: 'Document Vault', key: 'AWS S3 / Vault API', action: 'Stores encrypted copies of identity proofs, bank credentials, and digital agreements with secure temporary links.' }
                ]" :key="idx" class="hover:bg-neutral-50 dark:hover:bg-neutral-950/50 transition-colors">
                  <td class="px-6 py-4 font-bold text-neutral-900 dark:text-white whitespace-nowrap">{{ intg.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap"><span class="font-mono bg-neutral-100 dark:bg-neutral-800 text-[10px] px-2 py-0.5 rounded border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-700 dark:text-neutral-300 font-semibold">{{ intg.key }}</span></td>
                  <td class="px-6 py-4 text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ intg.action }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- TAB 4: TECHNICAL & DATA -->
      <div v-if="activeTab === 'technical'" class="space-y-12 animate-fade-in">
        
        <!-- Interactive Database Schema Explorer -->
        <div class="space-y-6">
          <div class="max-w-2xl">
            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-database" class="text-primary-500" />
              Entity Schema Explorer
            </h2>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Explore structural tables modeling the loan system. Select any entity to preview the schema properties.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Sidebar selectors -->
            <div class="space-y-2 lg:col-span-1">
              <button
                v-for="ent in entities"
                :key="ent.name"
                @click="selectedEntity = ent.name"
                :class="[
                  'w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer',
                  selectedEntity === ent.name
                    ? 'bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-400 font-bold'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200/50 dark:border-neutral-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-950'
                ]"
              >
                <span>{{ ent.name }}</span>
                <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
              </button>
            </div>

            <!-- Detail panel -->
            <div class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col justify-between">
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-primary-500">
                  <UIcon name="i-lucide-table-properties" class="w-6 h-6" />
                  <h3 class="font-bold text-xl text-neutral-900 dark:text-white">
                    {{ selectedEntity }}
                  </h3>
                </div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  {{ entities.find(e => e.name === selectedEntity)?.desc }}
                </p>
                <div class="space-y-2">
                  <span class="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Fields Definition</span>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div 
                      v-for="field in entities.find(e => e.name === selectedEntity)?.fields" 
                      :key="field"
                      class="font-mono text-[11px] p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 rounded flex items-center justify-between text-neutral-700 dark:text-neutral-300"
                    >
                      <span class="font-semibold">{{ field.split(' ')[0] }}</span>
                      <span class="text-neutral-400 dark:text-neutral-500 text-[10px]">{{ field.split(' ').slice(1).join(' ') }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                <UIcon name="i-lucide-info" class="w-3.5 h-3.5 text-neutral-400" />
                <span>Secure relational keys configured via UUID mappings</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical & Security Stack -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Architecture Features -->
          <div class="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm space-y-6">
            <h3 class="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-terminal" class="text-primary-500" />
              Technical Architecture Recommendations
            </h3>
            
            <div class="space-y-4">
              <div>
                <span class="text-xs font-bold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider mb-2">Backend Capabilities</span>
                <ul class="text-xs text-neutral-600 dark:text-neutral-300 space-y-2 list-inside list-disc">
                  <li>**State Machine Engine**: Decoupled state machines processing application levels.</li>
                  <li>**Event-Driven Workers**: Job-listeners triggering message channels asynchronously.</li>
                  <li>**Reconciliation Cron**: Automated ledger validation checking daily deduction balances.</li>
                </ul>
              </div>
              <div>
                <span class="text-xs font-bold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider mb-2">Frontend Capabilities</span>
                <ul class="text-xs text-neutral-600 dark:text-neutral-300 space-y-2 list-inside list-disc">
                  <li>**Reactive Amortization Sliders**: Interactive formula computations utilizing client-side scripts.</li>
                  <li>**Dynamic Stepper Wizards**: Intuitive navigation with active validation indicators.</li>
                  <li>**Visual Ledger Metrics**: Canvas chart libraries displaying outstanding debt progress.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Security Considerations -->
          <div class="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm space-y-6">
            <h3 class="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-shield" class="text-primary-500" />
              Security & Compliance Parameters
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Handling employee finance mandates strict security paradigms to ensure privacy compliance and reduce vulnerabilities.
            </p>
            <div class="space-y-3">
              <div v-for="(sec, idx) in [
                { title: 'Access Control (RBAC)', desc: 'Rigorous validation checking role permissions (Employee, Admin, Finance, Payroll) on API layers.' },
                { title: 'Financial Cryptography', desc: 'Secure hash mappings protecting sensitive employee routing digits and balance logs.' },
                { title: 'Reconciliation Logs', desc: 'Encapsulating each manual override or ledger settlement inside immutable logging events.' },
                { title: 'Data Privacy Compliance', desc: 'Fully compliant with national financial standards safeguarding employee profile items.' }
              ]" :key="idx" class="flex gap-3">
                <div class="p-1 rounded bg-emerald-500/10 text-emerald-500 h-fit">
                  <UIcon name="i-lucide-shield-alert" class="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-neutral-900 dark:text-white">{{ sec.title }}</h4>
                  <p class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">{{ sec.desc }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- TAB 5: UI CHECKLIST & UX WALKTHROUGH -->
      <div v-if="activeTab === 'uichecklist'" class="space-y-12 animate-fade-in">
        
        <!-- Summary Stats Card -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-palette" class="text-primary-500" />
              Submodule UI Checklist
            </h2>
            <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
              Use this structural checklist to track frontend development progress of standard views, form components, overlay modals, and data charts.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Checklist 1: Pages & Shell Layouts -->
              <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm space-y-4">
                <div class="flex items-center gap-2 text-primary-500">
                  <UIcon name="i-lucide-layout" class="w-5 h-5" />
                  <h3 class="font-bold text-sm text-neutral-900 dark:text-white">Pages & Shell Layouts</h3>
                </div>
                <div class="space-y-2">
                  <div v-for="(item, idx) in [
                    { t: 'Employee Self-Service Dashboard Widget', s: 'Planned' },
                    { t: 'HR Admin Policy Configuration Board', s: 'Planned' },
                    { t: 'Payroll Cutoff Synchronization Panel', s: 'Planned' },
                    { t: 'Finance Accounting General Ledger View', s: 'Planned' }
                  ]" :key="idx" class="flex items-center justify-between text-xs p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30">
                    <span class="text-neutral-700 dark:text-neutral-300 font-medium">{{ item.t }}</span>
                    <span :class="[
                      'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border font-sans',
                      item.s === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                      item.s === 'In Progress' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                    ]">{{ item.s }}</span>
                  </div>
                </div>
              </div>

              <!-- Checklist 2: Overlays, Modals & Dialogs -->
              <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm space-y-4">
                <div class="flex items-center gap-2 text-primary-500">
                  <UIcon name="i-lucide-layers" class="w-5 h-5" />
                  <h3 class="font-bold text-sm text-neutral-900 dark:text-white">Overlays & Modals</h3>
                </div>
                <div class="space-y-2">
                  <div v-for="(item, idx) in [
                    { t: 'Multi-Step Loan Application Wizard Modal', s: 'Planned' },
                    { t: 'HR Custom Loan Program Creator Drawer', s: 'Planned' },
                    { t: 'Manager Comments & Approval Dialog', s: 'Planned' },
                    { t: 'Early Repayment Settlement Calculator', s: 'Planned' }
                  ]" :key="idx" class="flex items-center justify-between text-xs p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30">
                    <span class="text-neutral-700 dark:text-neutral-300 font-medium">{{ item.t }}</span>
                    <span :class="[
                      'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border font-sans',
                      item.s === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                      item.s === 'In Progress' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                    ]">{{ item.s }}</span>
                  </div>
                </div>
              </div>

              <!-- Checklist 3: Forms & User Inputs -->
              <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm space-y-4">
                <div class="flex items-center gap-2 text-primary-500">
                  <UIcon name="i-lucide-text-cursor-input" class="w-5 h-5" />
                  <h3 class="font-bold text-sm text-neutral-900 dark:text-white">Forms & Interactive Inputs</h3>
                </div>
                <div class="space-y-2">
                  <div v-for="(item, idx) in [
                    { t: 'Interactive Loan Calculator Sliders', s: 'Planned' },
                    { t: 'Secure PDF Document Uploader Dropzone', s: 'Planned' },
                    { t: 'Rule-Based Workflow Builder Form', s: 'Planned' },
                    { t: 'Multi-Signature Signature Agreement', s: 'Planned' }
                  ]" :key="idx" class="flex items-center justify-between text-xs p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30">
                    <span class="text-neutral-700 dark:text-neutral-300 font-medium">{{ item.t }}</span>
                    <span :class="[
                      'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border font-sans',
                      item.s === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                      item.s === 'In Progress' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                    ]">{{ item.s }}</span>
                  </div>
                </div>
              </div>

              <!-- Checklist 4: Visuals & Charts -->
              <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm space-y-4">
                <div class="flex items-center gap-2 text-primary-500">
                  <UIcon name="i-lucide-bar-chart" class="w-5 h-5" />
                  <h3 class="font-bold text-sm text-neutral-900 dark:text-white">Charts & Data Visuals</h3>
                </div>
                <div class="space-y-2">
                  <div v-for="(item, idx) in [
                    { t: 'Amortization Stacked Area Chart', s: 'Planned' },
                    { t: 'Collection Efficiency Rate Gauge', s: 'Planned' },
                    { t: 'Loan Capital Allocation Pie Chart', s: 'Planned' },
                    { t: 'Turnaround Time Average Bar Chart', s: 'Planned' }
                  ]" :key="idx" class="flex items-center justify-between text-xs p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30">
                    <span class="text-neutral-700 dark:text-neutral-300 font-medium">{{ item.t }}</span>
                    <span :class="[
                      'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border font-sans',
                      item.s === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                      item.s === 'In Progress' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                    ]">{{ item.s }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- UI/UX Overall Progress Tracker -->
          <div class="p-6 rounded-2xl bg-gradient-to-b from-primary-500/5 to-emerald-500/5 border border-primary-500/10 space-y-6">
            <h3 class="font-bold text-lg text-neutral-900 dark:text-white">UI Implementation</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>UI COMPONENTS IMPLEMENTED</span>
                  <span class="text-primary-500">0 / 16 (0%)</span>
                </div>
                <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 0%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>ACCESSIBILITY / COMPLIANCE</span>
                  <span class="text-primary-500">100% WCAG</span>
                </div>
                <div class="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" style="width: 100%"></div>
                </div>
              </div>
            </div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-200/20 pt-4 space-y-2">
              <span class="font-bold uppercase tracking-wider block text-[10px]">Framework Stack</span>
              <p>Designed using **Nuxt UI v3** layout components and **Tailwind CSS v4** responsive guidelines.</p>
            </div>
          </div>
        </div>

        <!-- Submodule UI Hierarchy Tree Checklist -->
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/30 dark:border-neutral-800/30 pb-4">
            <div>
              <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-lucide-git-merge" class="text-primary-500" />
                Submodule UI Hierarchy Tree
              </h2>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                An interactive, details-rich checklist tree illustrating all pages, subpages, side drawers, and overlay modals.
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                @click="expandAll"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors border border-neutral-200/50 dark:border-neutral-800/50 cursor-pointer"
              >
                <UIcon name="i-lucide-expand" class="w-3.5 h-3.5" />
                <span>Expand All</span>
              </button>
              <button
                @click="collapseAll"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors border border-neutral-200/50 dark:border-neutral-800/50 cursor-pointer"
              >
                <UIcon name="i-lucide-collapse" class="w-3.5 h-3.5" />
                <span>Collapse All</span>
              </button>
            </div>
          </div>

          <!-- Tree Control Panel (Search & Legend) -->
          <div class="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Search field -->
            <div class="relative max-w-sm w-full">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
                <UIcon name="i-lucide-search" class="w-4 h-4" />
              </span>
              <input
                v-model="treeSearchQuery"
                type="text"
                placeholder="Filter tree nodes, types, or descriptions..."
                class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-neutral-900 dark:text-white"
              />
            </div>

            <!-- Legend badges -->
            <div class="flex flex-wrap gap-2 text-[9px] font-bold">
              <span class="px-2 py-0.5 rounded border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-sans">Page</span>
              <span class="px-2 py-0.5 rounded border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-sans font-medium">Subpage</span>
              <span class="px-2 py-0.5 rounded border bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 font-sans font-medium">Drawer</span>
              <span class="px-2 py-0.5 rounded border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-sans font-medium">Modal</span>
              <span class="px-2 py-0.5 rounded border bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 font-sans font-medium">Form Input</span>
              <span class="px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-sans font-medium">Form & Chart</span>
            </div>
          </div>

          <!-- Tree View Elements -->
          <div class="space-y-4">
            <div v-if="filteredUiTree.length === 0" class="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
              <UIcon name="i-lucide-search-code" class="w-8 h-8 text-neutral-400 mb-2 animate-bounce" />
              <p class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">No matching UI elements found.</p>
              <p class="text-xs text-neutral-400 mt-1">Try resetting your search query.</p>
            </div>

            <!-- Page Nodes (Root level) -->
            <div 
              v-for="page in filteredUiTree" 
              :key="page.name"
              class="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary-500"
            >
              <!-- Page header block -->
              <div 
                @click="toggleNode(page.name)"
                class="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50 transition-colors"
              >
                <div class="flex items-center gap-3.5 min-w-0">
                  <div class="p-2.5 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                    <UIcon :name="page.icon || 'i-lucide-file'" class="w-5.5 h-5.5" />
                  </div>
                  <div class="min-w-0 space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white truncate">
                        {{ page.name }}
                      </h3>
                      <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-sans">
                        {{ page.type }}
                      </span>
                      <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20 font-sans">
                        Planned
                      </span>
                    </div>
                    <p class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                      {{ page.desc }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                    ({{ page.children?.length || 0 }} items)
                  </span>
                  <div class="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500">
                    <UIcon 
                      :name="expandedNodes.includes(page.name) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                      class="w-4 h-4 transition-transform duration-200" 
                    />
                  </div>
                </div>
              </div>

              <!-- Page Children (Second Level) -->
              <div 
                v-if="expandedNodes.includes(page.name) && page.children && page.children.length > 0"
                class="border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/20 dark:bg-neutral-950/10 p-4 sm:p-5 space-y-4"
              >
                <div 
                  v-for="subNode in page.children" 
                  :key="subNode.name"
                  class="relative pl-6 sm:pl-8 border-l border-neutral-200 dark:border-neutral-800"
                >
                  <!-- Branch indicator dot -->
                  <div class="absolute top-4 left-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"></div>

                  <div class="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl p-3.5 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                    <div 
                      @click="subNode.children && subNode.children.length > 0 ? toggleNode(subNode.name) : null"
                      :class="[
                        'flex items-start justify-between gap-4',
                        subNode.children && subNode.children.length > 0 ? 'cursor-pointer select-none' : ''
                      ]"
                    >
                      <div class="min-w-0 space-y-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <h4 class="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
                            {{ subNode.name }}
                          </h4>
                          <span 
                            :class="[
                              'text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border font-sans',
                              subNode.type.includes('Subpage') ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-medium' :
                              subNode.type.includes('Drawer') ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 font-medium' :
                              subNode.type.includes('Modal') ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium' :
                              'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 font-medium'
                            ]"
                          >
                            {{ subNode.type }}
                          </span>
                          <span class="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20 font-sans">
                            Planned
                          </span>
                        </div>
                        <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          {{ subNode.desc }}
                        </p>
                      </div>
                      <div 
                        v-if="subNode.children && subNode.children.length > 0"
                        class="w-6 h-6 rounded border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 shrink-0"
                      >
                        <UIcon 
                          :name="expandedNodes.includes(subNode.name) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                          class="w-3.5 h-3.5"
                        />
                      </div>
                    </div>

                    <!-- Subpage Children (Third Level Components) -->
                    <div 
                      v-if="expandedNodes.includes(subNode.name) && subNode.children && subNode.children.length > 0"
                      class="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3 pl-4 border-l-2 border-l-primary-500/20"
                    >
                      <div 
                        v-for="leafNode in subNode.children" 
                        :key="leafNode.name"
                        class="flex items-start justify-between gap-4 p-2.5 rounded bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/30 dark:border-neutral-800/30"
                      >
                        <div class="space-y-1">
                          <div class="flex items-center gap-2 flex-wrap">
                            <h5 class="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
                              {{ leafNode.name }}
                            </h5>
                            <span 
                              :class="[
                                'text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border font-sans',
                                leafNode.type.includes('Chart') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium' :
                                'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 font-medium'
                              ]"
                            >
                              {{ leafNode.type }}
                            </span>
                            <span class="text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20 font-sans">
                              Planned
                            </span>
                          </div>
                          <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            {{ leafNode.desc }}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive UI/UX Flow Walkthrough Simulator -->
        <div class="space-y-6">
          <div class="max-w-2xl">
            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-gamepad-2" class="text-primary-500" />
              Interactive UI/UX Walkthrough
            </h2>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Click through the 4 steps of the Loan Submodule flow below to preview the target components, inputs, and screens involved at each phase.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Walkthrough Nav buttons -->
            <div class="space-y-2 lg:col-span-1">
              <button
                v-for="step in uxSteps"
                :key="step.step"
                @click="activeUxStep = step.step"
                :class="[
                  'w-full flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer',
                  activeUxStep === step.step
                    ? 'bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-400 font-bold'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200/50 dark:border-neutral-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-950'
                ]"
              >
                <div :class="[
                  'p-2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 shrink-0 flex items-center justify-center',
                  activeUxStep === step.step ? 'bg-primary-500 text-white dark:text-neutral-950' : ''
                ]">
                  <UIcon :name="step.icon" class="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span class="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold font-mono">Step {{ step.step }}</span>
                  <span class="truncate block max-w-[180px]">{{ step.title.split(' & ')[0] }}</span>
                </div>
              </button>
            </div>

            <!-- Walkthrough screen preview board -->
            <div class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm flex flex-col justify-between">
              <div class="space-y-6">
                <!-- Title & Header -->
                <div class="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <div class="p-2.5 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                    <UIcon :name="activeStepData?.icon" class="w-6 h-6" />
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-primary-500 uppercase tracking-widest font-mono">Screen Flow Walkthrough</span>
                    <h3 class="font-extrabold text-lg text-neutral-900 dark:text-white">
                      {{ activeStepData?.title }}
                    </h3>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {{ activeStepData?.desc }}
                </p>

                <!-- Views & Key UI Elements -->
                <div class="space-y-3">
                  <span class="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Target UI Components & Views</span>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div 
                      v-for="v in activeStepData?.views" 
                      :key="v"
                      class="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg text-xs text-neutral-700 dark:text-neutral-300 font-medium"
                    >
                      <UIcon name="i-lucide-component" class="w-4 h-4 text-primary-500 shrink-0" />
                      <span>{{ v }}</span>
                    </div>
                  </div>
                </div>

                <!-- Interactive triggers -->
                <div class="p-3 bg-primary-500/5 rounded-xl border border-primary-500/10 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium">
                    <UIcon name="i-lucide-activity" class="w-4 h-4" />
                    <span>Trigger Action:</span>
                    <span class="font-bold underline">{{ activeStepData?.action }}</span>
                  </div>
                  <button 
                    @click="activeUxStep = activeUxStep === 4 ? 1 : activeUxStep + 1"
                    class="text-[10px] font-extrabold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-lg shadow-sm border border-primary-600/10 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Next step</span>
                    <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </UContainer>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
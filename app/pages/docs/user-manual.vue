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
    { label: 'Employee', icon: 'i-lucide-id-card', slot: 'employee' },
    { label: 'Supervisor', icon: 'i-lucide-user-cog', slot: 'supervisor' },
    { label: 'Human Resources', icon: 'i-lucide-users', slot: 'hr' },
    { label: 'Finance', icon: 'i-lucide-landmark', slot: 'finance' },
    { label: 'Payroll', icon: 'i-lucide-wallet', slot: 'payroll' },
    { label: 'Administrator', icon: 'i-lucide-shield-check', slot: 'admin' }
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
            <UBadge label="Role-Based Instructions" icon="i-lucide-user" variant="subtle" color="primary" size="lg" class="rounded-full px-3 py-1.5 w-fit" />
            <div class="flex flex-col gap-3 mt-6">
                <h1 class="text-3xl sm:text-5xl text-pretty font-bold text-highlighted">
                    User <span class="text-primary-600 dark:text-primary-400">Manual</span>
                </h1>
                <p class="text-lg text-pretty text-primary-600 dark:text-primary-700 font-light">
                    Comprehensive step-by-step instructions for utilizing the Loan Management Platform.
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
            
            <!-- EMPLOYEE -->
            <template #employee>
                <div class="space-y-6 animate-fade-in w-full">
                    <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                        <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                            <UIcon name="i-lucide-id-card" class="size-8 text-primary" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">Employee Self-Service</h3>
                            <p class="text-sm text-neutral-500">Apply for loans and track your repayment progress.</p>
                        </div>
                    </div>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-plus-circle" class="text-primary size-5"/> Applying for a New Loan</h4>
                        </template>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Self-Service</UBadge> &gt; <UBadge variant="soft">Apply for Loan</UBadge> in the sidebar.</li>
                            <li class="pl-2">Select a loan type (e.g., Salary Loan, Emergency Loan). The system will automatically display the maximum allowed amount and required documents.</li>
                            <li class="pl-2">Enter your requested amount and desired repayment term (in months).</li>
                            <li class="pl-2">The built-in loan calculator will instantly show your estimated monthly deduction, total interest, and total payable amount.</li>
                            <li class="pl-2">Review the details and click <UButton size="sm" class="pointer-events-none align-middle mx-1">Submit Application</UButton>.</li>
                        </ol>
                        <UAlert title="Workflow Tracking" description="Your application is automatically routed to your Supervisor for the first level of approval. You can track its status in the 'My Loans' table." icon="i-lucide-git-commit" color="info" variant="soft" class="mt-6" />
                    </UCard>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-wallet-cards" class="text-primary size-5"/> Tracking My Loans</h4>
                        </template>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Self-Service</UBadge> &gt; <UBadge variant="soft">My Loans</UBadge>.</li>
                            <li class="pl-2">The top dashboard displays your total active loans, remaining balances, and next scheduled deduction.</li>
                            <li class="pl-2">Click the <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-eye" class="pointer-events-none align-middle mx-1" /> view icon on any loan to open the details drawer.</li>
                            <li class="pl-2">In the drawer, you can view the complete amortization schedule and see exactly which payments have been processed and which are pending.</li>
                        </ol>
                    </UCard>
                </div>
            </template>

            <!-- SUPERVISOR -->
            <template #supervisor>
                <div class="space-y-6 animate-fade-in w-full">
                    <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                        <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                            <UIcon name="i-lucide-user-cog" class="size-8 text-primary" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">Supervisor Actions</h3>
                            <p class="text-sm text-neutral-500">First-level review and team monitoring.</p>
                        </div>
                    </div>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-check-square" class="text-primary size-5"/> Reviewing Applications</h4>
                        </template>
                        <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            As a supervisor, you are the first gatekeeper in the approval pipeline. You are responsible for verifying the employee's justification for the loan.
                        </p>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Workflow &amp; Approvals</UBadge> &gt; <UBadge variant="soft">Approval Queue</UBadge>.</li>
                            <li class="pl-2">The queue will display applications specifically awaiting your review.</li>
                            <li class="pl-2">Click the <UButton size="sm" color="primary" variant="soft" class="pointer-events-none align-middle mx-1">Review</UButton> button to open the application details modal.</li>
                            <li class="pl-2">Review the requested amount, terms, and the employee's current salary details.</li>
                            <li class="pl-2">Add any necessary comments in the text area.</li>
                            <li class="pl-2">Click either <UButton size="xs" color="success" variant="solid" icon="i-lucide-check" class="pointer-events-none align-middle mx-1">Approve</UButton> or <UButton size="xs" color="error" variant="solid" icon="i-lucide-x" class="pointer-events-none align-middle mx-1">Reject</UButton>.</li>
                        </ol>
                        <UAlert title="Automatic Routing" description="Upon your approval, the application will automatically move to the HR queue. Rejections will immediately terminate the application and notify the employee." icon="i-lucide-route" color="warning" variant="soft" class="mt-6" />
                    </UCard>
                </div>
            </template>

            <!-- HR -->
            <template #hr>
                <div class="space-y-6 animate-fade-in w-full">
                    <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                        <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                            <UIcon name="i-lucide-users" class="size-8 text-primary" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">Human Resources</h3>
                            <p class="text-sm text-neutral-500">Policy enforcement, loan types, and employee management.</p>
                        </div>
                    </div>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-file-cog" class="text-primary size-5"/> Managing Loan Types</h4>
                        </template>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Loan Operations</UBadge> &gt; <UBadge variant="soft">Loan Types</UBadge>.</li>
                            <li class="pl-2">Here you can define new loan categories (e.g., Salary, Calamity, Laptop).</li>
                            <li class="pl-2">For each type, you can configure critical business rules:
                                <ul class="list-disc list-inside mt-2 space-y-1 text-dimmed ml-2">
                                    <li>Interest Rate (%)</li>
                                    <li>Maximum allowed amount</li>
                                    <li>Minimum tenure requirements (e.g., must be employed for 12 months)</li>
                                    <li>Required documentation</li>
                                </ul>
                            </li>
                            <li class="pl-2">Toggle the <UBadge variant="subtle" color="success">Active</UBadge> status to make the loan available or hidden from employees.</li>
                        </ol>
                    </UCard>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-users" class="text-primary size-5"/> Employee Directory</h4>
                        </template>
                        <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            HR has full access to manage employee profiles and system access.
                        </p>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Admin &amp; Reports</UBadge> &gt; <UBadge variant="soft">Employee Directory</UBadge>.</li>
                            <li class="pl-2">Select an employee to edit their profile.</li>
                            <li class="pl-2">You can assign their <strong>System Role</strong> (e.g., promoting an Employee to Finance), which instantly updates their sidebar navigation access based on the RBAC matrix.</li>
                            <li class="pl-2">Update base salaries which are used for Debt Service Ratio (DSR) calculations.</li>
                        </ol>
                    </UCard>
                </div>
            </template>

            <!-- FINANCE -->
            <template #finance>
                <div class="space-y-6 animate-fade-in w-full">
                    <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                        <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                            <UIcon name="i-lucide-landmark" class="size-8 text-primary" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">Finance Department</h3>
                            <p class="text-sm text-neutral-500">Final disbursements, ledger tracking, and analytics.</p>
                        </div>
                    </div>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-check-circle" class="text-primary size-5"/> Final Approval &amp; Auto-Disbursement</h4>
                        </template>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Finance is the final step in the <UBadge variant="soft">Approval Queue</UBadge>.</li>
                            <li class="pl-2">Review the financial risk and Debt Service Ratio (DSR) of the application.</li>
                            <li class="pl-2">When you click <strong>Approve</strong>, the system's Financial Engine will trigger.</li>
                            <li class="pl-2">The system will automatically:
                                <ul class="list-disc list-inside mt-2 space-y-1 text-dimmed ml-2">
                                    <li>Transition the loan status to <UBadge variant="soft" color="info">Disbursed</UBadge>.</li>
                                    <li>Generate a flat-rate amortization schedule based on the term and interest rate.</li>
                                    <li>Schedule corresponding payroll deductions for the Payroll team.</li>
                                    <li>Create an initial disbursement entry in the Transaction Ledger.</li>
                                </ul>
                            </li>
                        </ol>
                    </UCard>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-receipt" class="text-primary size-5"/> Repayment Tracker</h4>
                        </template>
                        <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            Monitor the financial health and outstanding balances of all active loans in the company.
                        </p>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Loan Operations</UBadge> &gt; <UBadge variant="soft">Repayment Tracker</UBadge>.</li>
                            <li class="pl-2">View aggregated progress bars showing the percentage of each loan paid off.</li>
                            <li class="pl-2">Open the details drawer to view the immutable <strong>Transaction Ledger</strong>, which logs every disbursement and repayment event for audit purposes.</li>
                        </ol>
                    </UCard>
                </div>
            </template>
            
            <!-- PAYROLL -->
            <template #payroll>
                <div class="space-y-6 animate-fade-in w-full">
                    <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                        <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                            <UIcon name="i-lucide-wallet" class="size-8 text-primary" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">Payroll Integration</h3>
                            <p class="text-sm text-neutral-500">Batch processing of monthly deductions.</p>
                        </div>
                    </div>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-calculator" class="text-primary size-5"/> Processing Deductions</h4>
                        </template>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Loan Operations</UBadge> &gt; <UBadge variant="soft">Payroll Deductions</UBadge>.</li>
                            <li class="pl-2">The table displays all scheduled deductions mapped to the current payroll cycle (e.g., end of month).</li>
                            <li class="pl-2">You can hold or adjust specific deductions if an employee has insufficient net pay for the period.</li>
                            <li class="pl-2">Click the <UButton size="sm" icon="i-lucide-play-circle" class="pointer-events-none align-middle mx-1">Run Payroll Batch</UButton> button at the top right of the page.</li>
                            <li class="pl-2">The system will process all scheduled deductions, mark them as <UBadge variant="subtle" color="success">Processed</UBadge>, and automatically decrement the running balances on the respective loan amortization schedules.</li>
                        </ol>
                        <UAlert title="Seamless Ledger Updates" description="Processing payroll deductions automatically creates repayment entries in the Finance department's Transaction Ledger." icon="i-lucide-repeat" color="primary" variant="soft" class="mt-6" />
                    </UCard>
                </div>
            </template>

            <!-- ADMIN -->
            <template #admin>
                <div class="space-y-6 animate-fade-in w-full">
                    <div class="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                        <div class="size-12 rounded-2xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary">
                            <UIcon name="i-lucide-shield-check" class="size-8 text-primary" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">System Administrator</h3>
                            <p class="text-sm text-neutral-500">Global configurations and compliance auditing.</p>
                        </div>
                    </div>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-activity" class="text-primary size-5"/> Global Audit Ledger</h4>
                        </template>
                        <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            The system maintains a centralized, immutable log of all actions for compliance and troubleshooting.
                        </p>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Admin &amp; Reports</UBadge> &gt; <UBadge variant="soft">Audit Logs</UBadge>.</li>
                            <li class="pl-2">You can view a chronological timeline of events aggregated from every namespace (Approvals, Payroll, Loan Creations).</li>
                            <li class="pl-2">Use the search to track down specific loan references or user actions.</li>
                        </ol>
                    </UCard>

                    <UCard variant="subtle">
                        <template #header>
                            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-settings" class="text-primary size-5"/> System Settings</h4>
                        </template>
                        <ol class="space-y-4 list-decimal list-outside ml-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <li class="pl-2">Navigate to <UBadge variant="soft">Admin &amp; Reports</UBadge> &gt; <UBadge variant="soft">System Settings</UBadge>.</li>
                            <li class="pl-2">Toggle global policies such as <strong>Auto-Disburse on Approval</strong> or <strong>Maintenance Mode</strong>.</li>
                            <li class="pl-2">Changes made here affect the platform globally and instantly.</li>
                        </ol>
                    </UCard>
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

<template>
  <div>
    <UPageHero
      title="Loan Management Platform"
      description="An integrated HRIS submodule designed to automate, manage, and monitor employee loan programs across the entire lifecycle — ensuring company policy alignment and financial compliance."
      :links="[{
        label: 'View Documentation',
        to: '/documentation',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }, {
        label: 'Implementation Roadmap',
        to: '/roadmap',
        icon: 'i-lucide-calendar',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    />

    <UPageSection
      id="features"
      title="Everything you need to streamline employee loans"
      description="Start with a production-ready HRIS submodule designed to digitize employee financial benefits and save hours of manual overhead."
      :features="[{
        icon: 'i-lucide-settings',
        title: 'Policy Configuration',
        description: 'Configure custom loan offerings, maximum thresholds, interest rate guidelines, and target eligibility constraints.'
      }, {
        icon: 'i-lucide-calculator',
        title: 'Automated Computation',
        description: 'Instantly generate complete amortization schedules, evaluate interest portions, and simulate payoff payouts.'
      }, {
        icon: 'i-lucide-wallet',
        title: 'Deep Payroll Sync',
        description: 'Bi-directional integration mapping salary deductions directly into payslips during active payroll run periods.'
      }, {
        icon: 'i-lucide-git-branch',
        title: 'Workflow Engine',
        description: 'Automate sequential reviews, routing loan applications to supervisors, HR managers, and financial approvers.'
      }, {
        icon: 'i-lucide-user-check',
        title: 'Self-Service Portals',
        description: 'Let employees submit loan requests, upload verification files, and track real-time outstanding ledger balances.'
      }, {
        icon: 'i-lucide-bar-chart-3',
        title: 'Analytics & Audits',
        description: 'Monitor aggregate collection rates, outstanding liabilities, policy versions, and historical approval audit logs.'
      }]"
    />

    <UPageSection>
      <UPageCTA
        title="Ready to automate employee loan programs?"
        description="Empower your HR, payroll, and finance departments with structured, transparent, and error-free loan lifecycle management."
        variant="subtle"
        :links="[{
          label: 'Explore the Docs',
          to: '/documentation',
          trailingIcon: 'i-lucide-arrow-right',
          color: 'neutral'
        }, {
          label: 'Check the Roadmap',
          to: '/roadmap',
          icon: 'i-lucide-calendar',
          color: 'neutral',
          variant: 'outline'
        }]"
      />
    </UPageSection>
  </div>
</template>

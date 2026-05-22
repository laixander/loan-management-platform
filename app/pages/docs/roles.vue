<script setup lang="ts">
import { ref } from 'vue'
import type { SystemRole } from '~/composables/useDemoAuth'

definePageMeta({
    layout: false
})

const { currentRole, setRole } = useDemoAuth()
const { isDemoDataSeeded, seedAll } = useDemoSeeder()
const router = useRouter()
const toast = useAppToast()

const selectedRole = ref<SystemRole>('Admin')
const shouldAutoSeed = ref(true)
const isLoggingIn = ref(false)

interface RoleProfile {
    role: SystemRole
    title: string
    subtitle: string
    description: string
    icon: string
    color: string
    badge: string
}

const roleProfiles: RoleProfile[] = [
    {
        role: 'Employee',
        title: 'Employee Self-Service',
        subtitle: 'Standard Staff Portal',
        description: 'Submit loan applications, view payment schedules, and track self-service repayment progress.',
        icon: 'i-lucide-user',
        color: 'text-blue-500 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30',
        badge: 'Staff'
    },
    {
        role: 'Supervisor',
        title: 'Line Supervisor',
        subtitle: 'First-Stage Approver',
        description: 'Perform initial screening reviews on team applications. Approve, reject, or request revisions.',
        icon: 'i-lucide-users',
        color: 'text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/30',
        badge: 'Reviewer'
    },
    {
        role: 'HR',
        title: 'HR Administrator',
        subtitle: 'Policy & Workflow Stage',
        description: 'Configure active loan offerings, eligibility rules, approval stages, and review parameters.',
        icon: 'i-lucide-shield-check',
        color: 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30',
        badge: 'Manager'
    },
    {
        role: 'Finance',
        title: 'Finance Officer',
        subtitle: 'Treasury & Ledger Sync',
        description: 'Verify financial compliance, process cash disbursement logs, and manage payment credits.',
        icon: 'i-lucide-landmark',
        color: 'text-amber-500 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30',
        badge: 'Disbursement'
    },
    {
        role: 'Payroll',
        title: 'Payroll Specialist',
        subtitle: 'Salary deduction mapper',
        description: 'Manage bi-directional deduction cycles. Schedule, adjust, or suspend repayment payroll integrations.',
        icon: 'i-lucide-wallet',
        color: 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/30',
        badge: 'Integrations'
    },
    {
        role: 'Admin',
        title: 'System Administrator',
        subtitle: 'Full System Control',
        description: 'Root access to all submodules, configurations, active user directories, and compliance audit logs.',
        icon: 'i-lucide-shield-alert',
        color: 'text-violet-500 bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/30',
        badge: 'Superuser'
    }
]

const handleLogin = async () => {
    isLoggingIn.value = true
    try {
        // Auto-seed if selected and not already seeded
        if (shouldAutoSeed.value && !isDemoDataSeeded.value) {
            toast.success('Deploying Mock Data', 'Initializing system database with high-fidelity records...')
            await seedAll()
        }

        // Apply selected role using useDemoAuth
        setRole(selectedRole.value)

        // Give a slight mock latency for rich UX feel
        await new Promise(resolve => setTimeout(resolve, 800))

        // Determine destination
        const destination = selectedRole.value === 'Employee' ? '/my-loans' : '/dashboard'
        
        toast.success(
            'Portal Session Started', 
            `Successfully logged in as simulated ${selectedRole.value}.`
        )
        
        await router.push(destination)
    } catch (error) {
        toast.error('Simulation Error', 'Failed to launch simulator session.')
    } finally {
        isLoggingIn.value = false
    }
}
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-neutral-50 dark:bg-neutral-950 transition-colors">
    <!-- Ambient glowing backgrounds for wow factor -->
    <div class="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
    <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

    <div class="max-w-5xl w-full flex flex-col items-center gap-10">
      
      <!-- Title & Branding Section -->
      <div class="text-center max-w-2xl space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
          <UIcon name="i-ph-car-duotone" class="w-4 h-4 text-primary" />
          <span>ParkSpot HRIS Suite</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Loan Management <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-500">Submodule</span>
        </h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Welcome to the interactive demonstration space. Select a simulated profile below to access the platform with tailored permissions and view real-time data flows.
        </p>
      </div>

      <!-- Main Login & Profile Card -->
      <div class="w-full bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
        <!-- Top decorative gradient line -->
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-purple-500 to-emerald-500" />

        <!-- Header -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 dark:border-neutral-800 pb-5 gap-3">
          <div>
            <h2 class="text-lg font-bold text-neutral-900 dark:text-white">Select User Persona</h2>
            <p class="text-xs text-neutral-400 mt-0.5">Simulate roles to explore features across the entire loan lifecycle.</p>
          </div>
          
          <!-- Database Seed Status Badge -->
          <div class="flex items-center gap-2 self-start sm:self-center">
            <span class="text-xs font-semibold" :class="isDemoDataSeeded ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
              {{ isDemoDataSeeded ? 'Mock Database Active' : 'System Needs Seed' }}
            </span>
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="isDemoDataSeeded ? 'bg-emerald-400' : 'bg-amber-400'"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" :class="isDemoDataSeeded ? 'bg-emerald-500' : 'bg-amber-500'"></span>
            </span>
          </div>
        </div>

        <!-- Role Select Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div 
            v-for="profile in roleProfiles" 
            :key="profile.role"
            @click="selectedRole = profile.role"
            class="group relative flex flex-col p-5 rounded-xl border cursor-pointer select-none transition-all duration-300 transform"
            :class="[
              selectedRole === profile.role 
                ? 'bg-neutral-50/80 dark:bg-neutral-800/30 border-primary-500 shadow-md scale-[1.02] ring-2 ring-primary-500/20' 
                : 'bg-neutral-50/30 dark:bg-neutral-950/20 border-neutral-200/60 dark:border-neutral-800/50 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/20 hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-700'
            ]"
          >
            <!-- Card Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300" :class="[
                  selectedRole === profile.role ? 'bg-primary-500/10 text-primary-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                ]">
                  <UIcon :name="profile.icon" class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-bold text-sm text-neutral-900 dark:text-white transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {{ profile.title }}
                  </h3>
                  <span class="text-[10px] text-neutral-400 block font-medium mt-0.5">{{ profile.subtitle }}</span>
                </div>
              </div>
              
              <!-- Custom Check Indicator -->
              <div class="flex items-center">
                <UIcon 
                  v-if="selectedRole === profile.role" 
                  name="i-lucide-check-circle-2" 
                  class="w-5 h-5 text-primary animate-scale-up" 
                />
                <div 
                  v-else 
                  class="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-400" 
                />
              </div>
            </div>

            <!-- Description -->
            <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1 flex-1">
              {{ profile.description }}
            </p>

            <!-- Bottom Specs -->
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-[10px]">
              <span class="font-medium text-neutral-400">Permissions</span>
              <span class="px-2.5 py-0.5 rounded-full font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                {{ profile.badge }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer / Action Area -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
          
          <!-- Auto-Seed Checkbox Options -->
          <div class="flex flex-col gap-1 max-w-md">
            <UCheckbox v-model="shouldAutoSeed" color="primary">
              <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                Auto-seed demo data on login
              </span>
            </UCheckbox>
            <p class="text-[10px] text-neutral-400 ml-6">
              Populates real-time active loan categories, team approvals, and monthly collections for immediate exploration.
            </p>
          </div>

          <!-- Login Launch Action Buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <UButton
              label="System Roadmap"
              to="/roadmap"
              color="neutral"
              variant="subtle"
              icon="i-lucide-map"
              size="lg"
              class="hidden sm:inline-flex"
            />
            <UButton
              label="Launch Simulated Session"
              color="primary"
              size="lg"
              class="font-bold px-6 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 shadow-md text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              trailing-icon="i-lucide-arrow-right"
              :loading="isLoggingIn"
              @click="handleLogin"
            />
          </div>
        </div>
      </div>

      <!-- Quick Platform Manual link / documentation banner -->
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink 
          to="/documentation"
          class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm hover:shadow-md hover:border-primary-500/30 transition-all duration-300 group"
        >
          <div class="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <UIcon name="i-lucide-book-open" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Platform Architecture Docs
            </h4>
            <p class="text-xs text-neutral-400">Read system specs, API schemas, and code guidelines.</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/roadmap"
          class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group"
        >
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <UIcon name="i-lucide-calendar" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Implementation Roadmap
            </h4>
            <p class="text-xs text-neutral-400">View progress phases, completed tasks, and target designs.</p>
          </div>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

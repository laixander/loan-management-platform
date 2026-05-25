// ============================================================================
// Middleware: auth (global)
// ============================================================================
// Redirects unauthenticated users to the login page.
// On the login page, if a role is already set, redirects to dashboard.

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()
    const { isDev } = useAppConfig()
    
    // In dev mode, we might want to bypass auth for the docs/agent routes
    if (isDev && (to.path.startsWith('/docs') || to.path.startsWith('/agent'))) {
        return
    }

    // Allow access to the login page
    if (to.path === '/') {
        // If already logged in, redirect to dashboard
        if (authStore.currentRole) {
            return navigateTo('/dashboard')
        }
        return
    }

    // Protect all other routes — redirect to login if no role is set
    if (!authStore.currentRole) {
        return navigateTo('/')
    }
})

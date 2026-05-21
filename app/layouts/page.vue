<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Loan Management Platform'
const description = 'An integrated HRIS submodule to automate, manage, and track employee loans throughout their lifecycle, ensuring policy alignment and compliance.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '',
  twitterCard: ''
})
</script>

<template>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
        <div class="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-neutral-200 dark:border-neutral-800">
          <UButton to="/documentation" variant="ghost" color="neutral" size="sm">Docs</UButton>
          <UButton to="/roadmap" variant="ghost" color="neutral" size="sm">Roadmap</UButton>
        </div>
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/laixander/loan-management-platform"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/laixander/loan-management-platform"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
</template>

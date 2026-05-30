<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en',
    class: 'scrollbar'
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

// FAB demo (remove in production)
const route = useRoute()
const isDevMode = computed(() => {
    if (import.meta.server) return false
    if (route.query.nodev !== undefined) {
        sessionStorage.removeItem('devMode')
        return false
    }
    if (route.query.dev !== undefined) {
        sessionStorage.setItem('devMode', '1')
        return true
    }
    return sessionStorage.getItem('devMode') === '1'
})
</script>
<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
            <ClientOnly>
                <DemoFab v-if="isDevMode" />
            </ClientOnly>
        </NuxtLayout>
    </UApp>
</template>
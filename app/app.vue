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
</script>
<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
            <DemoFab />
        </NuxtLayout>
    </UApp>
</template>
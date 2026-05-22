<script setup lang="ts">
definePageMeta({
    layout: false,
    title: 'Sample'
})
</script>
<template>
    <div class="relative border-b border-default py-8 overflow-hidden min-h-[33vh] flex flex-col justify-center">
        <UContainer>
            <div class="absolute top-4 right-4">
                <UColorModeButton color="primary" />
            </div>
            <UBadge label="System Updates" icon="i-lucide-file-text" variant="subtle" color="primary" size="lg" class="rounded-full px-3 py-1.5 w-fit" />
            <div class="flex flex-col gap-3 mt-6">
                <h1 class="text-3xl sm:text-5xl text-pretty font-bold text-highlighted">
                    Changelog &amp; <span class="text-primary-600 dark:text-primary-400">Release Notes</span>
                </h1>
                <p class="text-lg text-pretty text-primary-600 dark:text-primary-700 font-light">
                    Keep track of all new features, improvements, and architectural updates to the Loan Management Platform.
                </p>
            </div>
        </UContainer>
        <BackgroundGrid bg-color="bg-primary-50 dark:bg-primary-950" />
    </div>
    <UContainer class="mt-12">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
    </UContainer>
</template>
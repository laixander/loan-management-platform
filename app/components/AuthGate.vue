<script setup lang="ts">
defineProps<{
    title: string
    description?: string
    icon?: string
}>()
</script>

<template>
    <div class="flex flex-col items-center justify-center h-full flex-1 gap-4 text-center p-6">
        <UIcon :name="icon || 'i-lucide-shield-alert'" class="w-16 h-16 text-warning" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ title }}</h2>
        <p v-if="description" class="text-gray-500 max-w-md">
            {{ description }}
        </p>
        <slot />
    </div>
</template>

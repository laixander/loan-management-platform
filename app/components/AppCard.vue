<script setup lang="ts">
import { useSlots, computed } from 'vue'

const props = defineProps<{
  title?: string
  description?: string
}>()

const slots = useSlots()

// Only enable the custom header layout if one of our custom slots is active
const hasCustomHeader = computed(() => {
  return !!(
    slots.header ||
    slots.before ||
    slots.after ||
    slots.title ||
    slots.description
  )
})
</script>

<template>
  <!-- Forward the title and description props so UCard handles them when header slot is inactive -->
  <UCard :title="title" :description="description">
    
    <!-- Conditionally override the header slot only when custom slot extensions are active -->
    <template v-if="hasCustomHeader" #header>
      <slot v-if="$slots.header" name="header" />
      
      <div v-else class="flex items-center justify-between gap-4 w-full">
        <div class="flex items-start gap-3">
          <slot name="before" />
          
          <div>
            <slot name="title">
              <h3 v-if="title" class="text-highlighted font-semibold">
                {{ title }}
              </h3>
            </slot>
            <slot name="description">
              <p v-if="description" class="mt-1 text-muted text-sm">
                {{ description }}
              </p>
            </slot>
          </div>
        </div>

        <slot name="after" />
      </div>
    </template>

    <!-- Main Card Body -->
    <slot />

    <!-- Forward Footer Slot -->
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>
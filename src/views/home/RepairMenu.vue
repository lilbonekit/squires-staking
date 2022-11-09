<script setup>
defineProps({
  repairType: String,
  squiresMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu'])
</script>

<template>
  <div class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === `${repairType}/send` }">
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">{{ repairType.charAt(0).toUpperCase() + repairType.slice(1) }}</div>
      <p class="menu-description">Currently closed for repairs.</p>
    </header>
  </div>
</template>

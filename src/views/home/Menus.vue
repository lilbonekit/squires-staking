<script setup>
defineProps({
  showMenus: Boolean,
})
</script>

<template>
  <div id="Menus" :class="{ 'no-menus': !showMenus }">
    <slot></slot>
  </div>
</template>

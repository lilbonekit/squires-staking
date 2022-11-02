<script setup>
import Loader from '@/components/Loader.vue'
</script>

<template>
  <router-view v-slot="{ Component }">
    <suspense timeout="0">
      <template #default>
        <component v-if="Component" :is="Component" :key="$route.path"></component>
      </template>
      <template #fallback>
        <loader />
      </template>
    </suspense>
  </router-view>
</template>

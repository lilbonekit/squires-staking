<script>
import { nextTick } from 'vue'
export default {
  setup() {
    const shouldRender = ref(false)
    nextTick(() => {
      shouldRender.value = true
    })

    return { shouldRender }
  },
}
</script>
<template>
  <div>
    <slot v-if="shouldRender"></slot>
  </div>
</template>

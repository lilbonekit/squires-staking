<script setup>
defineProps({
  isHoverClass: Boolean,
  isWrongNetwork: Boolean,
  gateOpen: Boolean,
  enteredGate: Boolean,
  gateShow: Boolean,
  gateBtnShow: Boolean,
})

const emit = defineEmits(['handle-click-gate-btn', 'handle-hover-gate-btn'])
</script>

<template>
  <div id="Gate" :class="{ hovered: isHoverClass, entered: enteredGate }" v-if="gateShow">
    <button
      id="Gate__Button"
      class="btn"
      v-if="gateBtnShow"
      @click="() => emit('handle-click-gate-btn')"
      @mouseenter="() => emit('handle-hover-gate-btn', true)"
      @mouseleave="() => emit('handle-hover-gate-btn', false)"
    >
      {{ gateOpen ? 'Enter the Gates' : 'Gate is Locked' }}
    </button>
    <div id="wrong-network" class="centered_alert" v-if="isWrongNetwork">
      <p class="menu-description animated pulse" style="color: white; font-weight: 600">
        You are on the wrong network.<br /><a style="text-decoration: none; font-weight: 800; color: #b91809">Switch to Arbitrum</a> to Unlock the
        Gate.
      </p>
    </div>
    <div id="no-squires" class="centered_alert" style="display: none">
      <p class="menu-description animated pulse" style="color: white; font-weight: 600">
        You do not own any Squires.<br /><span style="color: #b91809">You must have at least 1 Squire</span> to Unlock the Gate.
      </p>
    </div>
    <div id="no-knights" class="centered_alert-knights" style="display: none">
      <p class="menu-description animated pulse" style="color: white; font-weight: 600">
        You do not own any Knights.<br /><a
          href="https://opensea.io/collection/knightsoftheethernft"
          target="_blank"
          style="text-decoration: none; font-weight: 800; color: #b91809"
          >Purchase at least 1 Knight</a
        >
        to Unlock the Gate.
      </p>
    </div>
    <div id="Gate__Left"></div>
    <div id="Gate__Right"></div>
  </div>
</template>

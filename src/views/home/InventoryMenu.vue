<script setup>
import { reactive } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

defineProps({
  inventoryMenuReady: Boolean,
})

const emit = defineEmits(['handle-click-inventory-item'])

const state = reactive({
  inventoryMenuActive: false,
})

const handleClickInventoryHeader = () => {
  state.inventoryMenuActive = !state.inventoryMenuActive
}
</script>

<template>
  <div id="Inventory" :class="{ active: state.inventoryMenuActive, ready: inventoryMenuReady }">
    <header id="Inventory__Header" class="menu-header" @click="() => handleClickInventoryHeader()">
      <div class="menu-label">Inventory</div>
    </header>
    <main id="Inventory__Main" class="menu-main">
      <button id="Inventory-Squires-Trigger" class="item inventory-item" @click="() => emit('handle-click-inventory-item', 'squires')">
        <header class="item-header">
          <span id="squireTotal">{{ store.state.items.squireTotal }}</span> Squires
        </header>
        <main class="item-main">
          <img class="menu-icon" src="/assets/images/beta/i/kote-icon-book.png" />
        </main>
      </button>
      <button id="Inventory-Fief-Trigger" class="item inventory-item" @click="() => emit('handle-click-inventory-item', 'fief')">
        <header class="item-header">
          <span id="fiefTotal">{{ store.state.items.fiefTotal }}</span> $FIEF
        </header>
        <main class="item-main">
          <img class="menu-icon" src="/assets/images/beta/i/kote-icon-inventory.png" />
        </main>
      </button>
      <button id="Inventory-Potion-Trigger" class="item inventory-item" @click="() => emit('handle-click-inventory-item', 'potion')">
        <header class="item-header">
          <span id="potionTotal">{{ store.state.items.potionTotal }}</span> Potions
        </header>
        <main class="item-main">
          <img class="menu-icon" src="/assets/images/beta/i/kote-icon-alchemy.png" />
        </main>
      </button>
      <button id="Inventory-Ring-Trigger" class="item inventory-item" @click="() => emit('handle-click-inventory-item', 'ring')">
        <header class="item-header">
          <span id="ringTotal">{{ store.state.items.ringTotal }}</span> Rings
        </header>
        <main class="item-main">
          <img class="menu-icon" src="/assets/images/beta/i/kote-icon-jewelry.png" />
        </main>
      </button>
      <button id="Inventory-Trinket-Trigger" class="item inventory-item" @click="() => emit('handle-click-inventory-item', 'trinket')">
        <header class="item-header">
          <span id="trinketTotal">{{ store.state.items.trinketTotal }}</span> Trinkets
        </header>
        <main class="item-main">
          <img class="menu-icon" src="/assets/images/beta/i/kote-icon-runes.png" />
        </main>
      </button>
      <button id="Inventory-Gear-Trigger" class="item inventory-item" @click="() => emit('handle-click-inventory-item', 'gear')">
        <header class="item-header">0 Gear</header>
        <main class="item-main">
          <img class="menu-icon" src="/assets/images/beta/i/kote-icon-craft.png" />
        </main>
      </button>
    </main>
  </div>
</template>

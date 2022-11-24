<script setup>
import { reactive, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { itemRarity } from '@/config/constants/inventoryItems'

const store = useStore()

const props = defineProps({
  inventoryItemMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu', 'handle-click-inventory-item'])

const state = reactive({
  itemType: '',
  loadingMenuDescription: '',
})
const menuActiveStatus = computed(() => props.inventoryItemMenuActiveStatus)
const menuDescription = computed(() =>
  store.state.items.itemsToWithdraw.length > 0 ? `Select the ${state.itemType}s you would like to withdraw` : `No ${state.itemType}s are ordered`,
)

watch(menuActiveStatus, newStatus => {
  if (newStatus.slice(0, newStatus.lastIndexOf('/')) === 'order/items') {
    const itemType = newStatus.split('/')[2]
    state.itemType = itemType
    state.loadingMenuDescription = `Loading ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}s to withdraw`
  }
})

const handleClickWithdrawAll = async () => {
  state.loadingMenuDescription = `Withdrawing ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s and Prompting Metamask`
  await store.dispatch('items/withdrawItems', store.state.items.itemsOrdered)
  store.commit('items/setSelectedItemsToWithdraw', [])
  emit('handle-click-inventory-item', `withdraw/items/${state.itemType}`)
}
</script>

<template>
  <!-- ordered items -->
  <div
    class="menu quest-menu"
    :class="{ 'menu-active': inventoryItemMenuActiveStatus.slice(0, inventoryItemMenuActiveStatus.lastIndexOf('/')) === 'order/items' }"
  >
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')" v-if="store.state.items.itemsOrdered.length > 0"></button>
      <div class="menu-label">Ordered {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}s</div>
      <p class="menu-description">
        <template v-if="store.state.items.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.items.loading"> {{ menuDescription }} </template>
      </p>
      <p class="menu-description" style="color: grey; text-size: 20px" v-if="store.state.items.itemsOrdered.length > 0">
        *If you close thid modal, you <i>lost these {{ state.itemType }}s</i> forever
      </p>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" v-for="item in store.state.items.itemsOrdered" :key="item.itemObj.id">
            <div class="token-image">
              <div class="menu-label">{{ itemRarity[item.itemObj.level] }}</div>
              <img :src="`/assets/images/${state.itemType}s/${item.itemObj.name}.png`" alt="no img" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value">{{ item.itemObj.amount }}</span>
                </li>
              </ul>
              <button class="btn quest">{{ item.itemObj.name }}</button>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.items.loading || store.state.items.itemsOrdered.length === 0 }"
            :disabled="store.state.items.loading || store.state.items.itemsOrdered.length === 0"
            @click="handleClickWithdrawAll"
          >
            Withdraw All
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

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
  selectedItems: [],
})
const menuActiveStatus = computed(() => props.inventoryItemMenuActiveStatus)
const showWithdrawBtn = computed(() => (state.selectedItems.length > 0 ? true : false))
const menuDescription = computed(() =>
  store.state.items.itemsToWithdraw.length > 0
    ? `Select the ${state.itemType}s you would like to withdraw`
    : `No ${state.itemType}s are deposited or earned`,
)
const loading = computed(() => store.state.items.loading)

watch(menuActiveStatus, newStatus => {
  if (newStatus.slice(0, newStatus.lastIndexOf('/')) === 'withdraw/items') {
    const itemType = newStatus.split('/')[2]
    state.itemType = itemType
    setTimeout(() => {
      state.loadingMenuDescription = `Loading ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}s to Withdraw`
      state.selectedItems = []
      store.dispatch('items/getItemsToWithdraw', itemType)
    }, 750)
  }
})
watch(loading, newStatus => {
  if (!newStatus) {
    state.selectedItems = []
    store.commit('items/setSelectedItemsToWithdraw', [])
  }
})

const isSelected = id => (state.selectedItems.filter(item => item.id === id).length > 0 ? true : false)

const handleClickRefresh = () => {
  state.loadingMenuDescription = `Loading ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s to Withdraw`
  state.selectedItems = []
  store.dispatch('items/getItemsToWithdraw', state.itemType)
}

const handleSelectItem = (id, amount) => {
  if (isSelected(id)) state.selectedItems = state.selectedItems.filter(item => item.id !== id)
  else state.selectedItems.push({ id, amount })
}

const handleClickWithdrawFew = async () => {
  state.loadingMenuDescription = `Withdrawing ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s and Prompting Metamask`
  store.commit('items/setSelectedItemsToWithdraw', state.selectedItems)
  await store.dispatch('items/requestWithdraw1155', state.itemType)
}

const handleClickWithdrawAll = async () => {
  state.loadingMenuDescription = `Withdrawing ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s and Prompting Metamask`
  const selectedItems = store.state.items.itemsToWithdraw.map(item => Object.assign({ id: item.id, amount: item.amount }))
  store.commit('items/setSelectedItemsToWithdraw', selectedItems)
  await store.dispatch('items/requestWithdraw1155', state.itemType)
}
</script>

<template>
  <!-- withdraw items -->
  <div
    class="menu quest-menu"
    :class="{ 'menu-active': inventoryItemMenuActiveStatus.slice(0, inventoryItemMenuActiveStatus.lastIndexOf('/')) === 'withdraw/items' }"
  >
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Withdraw {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}s</div>
      <p class="menu-description">
        <template v-if="store.state.items.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.items.loading">
          {{ menuDescription }}
        </template>
      </p>
      <button
        class="btn"
        :class="{ quest: store.state.items.loading }"
        :disabled="store.state.items.loading"
        @click="() => emit('handle-click-inventory-item', state.itemType)"
      >
        Check Deposited {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}s
      </button>
      <button class="btn" :class="{ quest: store.state.items.loading }" :disabled="store.state.items.loading" @click="() => handleClickRefresh()">
        Refresh
      </button>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" v-for="item in store.state.items.itemsToWithdraw" :key="item.id" :class="{ selected: isSelected(item.id) }">
            <div class="token-image">
              <div class="menu-label">{{ itemRarity[item.level] }}</div>
              <img :src="`/assets/images/${state.itemType}s/${item.name}.png`" alt="no img" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value">{{ item.amount }}</span>
                </li>
              </ul>
              <button class="btn quest" @click="() => handleSelectItem(item.id, item.amount)">
                {{ isSelected(item.id) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ item.id - 100 }}</span> {{ item.name }}
              </button>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.items.loading }"
            :disabled="store.state.items.loading"
            v-if="showWithdrawBtn"
            @click="handleClickWithdrawFew"
          >
            <span class="num-selected"
              ><span
                >Withdraw {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}(s) #
                {{ state.selectedItems.map(item => item.id - 100).toString() }}</span
              ></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.items.loading || store.state.items.itemsToWithdraw.length === 0 }"
            :disabled="store.state.items.loading || store.state.items.itemsToWithdraw.length === 0"
            @click="handleClickWithdrawAll"
          >
            Withdraw All
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

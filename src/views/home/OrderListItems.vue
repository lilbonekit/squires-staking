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
  selectedIndexes: [],
})
const menuActiveStatus = computed(() => props.inventoryItemMenuActiveStatus)
const showWithdrawBtn = computed(() => (state.selectedIndexes.length > 0 ? true : false))
const menuDescription = computed(() =>
  store.state.items.itemsOrdered.length > 0 ? `Select the ${state.itemType}s you would like to withdraw` : `No ${state.itemType}s are ordered`,
)
const itemsOrdered = computed(() =>
  store.state.items.itemsOrdered.filter(itemOrdered => itemOrdered.itemObj.type === state.itemType).sort((a, b) => a.itemObj.id - b.itemObj.id),
)

watch(menuActiveStatus, newStatus => {
  if (newStatus.slice(0, newStatus.lastIndexOf('/')) === 'order/items') {
    const itemType = newStatus.split('/')[2]
    state.itemType = itemType
    setTimeout(() => {
      state.loadingMenuDescription = `Loading ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}s to withdraw`
      state.selectedIndexes = []
      store.dispatch('items/requestWithdrawOrders')
    }, 750)
  }
})

const isSelected = index => (state.selectedIndexes.filter(selectedIndex => selectedIndex === index).length > 0 ? true : false)

const handleClickRefresh = () => {
  state.loadingMenuDescription = `Loading ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s to withdraw`
  state.selectedIndexes = []
  store.dispatch('items/requestWithdrawOrders')
}

const handleSelectItem = index => {
  if (isSelected(index)) state.selectedIndexes = state.selectedIndexes.filter(selectedIndex => selectedIndex !== index)
  else state.selectedIndexes.push(index)
}

const handleClickWithdrawFew = async () => {
  state.loadingMenuDescription = `Withdrawing ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s and Prompting Metamask`
  let items1155 = []
  state.selectedIndexes.forEach(selectedIndex => {
    items1155.push(itemsOrdered.value[selectedIndex])
  })
  await store.dispatch('items/withdrawItems', items1155)
  state.selectedIndexes = []
}

const handleClickWithdrawAll = async () => {
  state.loadingMenuDescription = `Requesting ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s and Prompting Metamask`
  await store.dispatch('items/withdrawItems', itemsOrdered.value)
  state.selectedIndexes = []
}
</script>

<template>
  <!-- ordered items -->
  <div
    class="menu quest-menu"
    :class="{ 'menu-active': inventoryItemMenuActiveStatus.slice(0, inventoryItemMenuActiveStatus.lastIndexOf('/')) === 'order/items' }"
  >
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Ordered {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}s to Withdraw</div>
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
        @click="() => emit('handle-click-inventory-item', `withdraw/items/${state.itemType}`)"
      >
        Check {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}s Ready to Withdraw
      </button>
      <button class="btn" :class="{ quest: store.state.items.loading }" :disabled="store.state.items.loading" @click="() => handleClickRefresh()">
        Refresh
      </button>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" v-for="(item, index) in itemsOrdered" :key="item.itemObj.id" :class="{ selected: isSelected(index) }">
            <div class="token-image">
              <div class="menu-label">{{ itemRarity[item.itemObj.level] }}</div>
              <img :src="`/assets/images/${state.itemType}s/${item.itemObj.name}.png`" alt="no img" />
            </div>
            <div class="token-stats">
              <ul style="display: flex; flex-direction: column; flex-wrap: nowrap">
                <li class="stat">
                  Amount: <span class="stat-value">{{ item.itemObj.amount }}</span>
                </li>
              </ul>
              <button class="btn quest" @click="() => handleSelectItem(index)">
                {{ isSelected(index) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ item.itemObj.id - 100 }}</span>
                {{ item.itemObj.name }}
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
                {{ state.selectedIndexes.map(selectedIndex => itemsOrdered[selectedIndex].itemObj.id - 100).toString() }}</span
              ></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.items.loading || itemsOrdered.length === 0 }"
            :disabled="store.state.items.loading || itemsOrdered.length === 0"
            @click="handleClickWithdrawAll"
          >
            Withdraw All
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

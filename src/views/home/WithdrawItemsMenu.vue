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
  withdrawAmounts: [],
})
const menuActiveStatus = computed(() => props.inventoryItemMenuActiveStatus)
const showWithdrawBtn = computed(() => (state.selectedItems.length > 0 ? true : false))
const menuDescription = computed(() =>
  store.state.items.itemsToWithdraw.length > 0
    ? `Select the ${state.itemType}s you would like to withdraw`
    : `No ${state.itemType}s are deposited or earned`,
)

watch(menuActiveStatus, newStatus => {
  if (newStatus.slice(0, newStatus.lastIndexOf('/')) === 'withdraw/items') {
    const itemType = newStatus.split('/')[2]
    state.itemType = itemType
    setTimeout(async () => {
      state.loadingMenuDescription = `Loading ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}s to withdraw`
      state.selectedItems = []
      await store.dispatch('items/getItemsToWithdraw', itemType)
      setTimeout(async () => {
        state.withdrawAmounts = new Array(store.state.items.itemsToWithdraw.length).fill(1)
      }, 500)
    }, 750)
  }
})

const isSelected = id => (state.selectedItems.filter(item => item.id === id).length > 0 ? true : false)

const handleClickRefresh = async () => {
  state.loadingMenuDescription = `Loading ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s to withdraw`
  state.selectedItems = []
  await store.dispatch('items/getItemsToWithdraw', state.itemType)
  setTimeout(async () => {
    state.withdrawAmounts = new Array(store.state.items.itemsToWithdraw.length).fill(1)
  }, 500)
}

const handleSelectItem = (id, amount) => {
  if (isSelected(id)) state.selectedItems = state.selectedItems.filter(item => item.id !== id)
  else state.selectedItems.push({ id, amount })
}

const handleInputChange = (index, totalAmount) => {
  if (state.withdrawAmounts[index] > totalAmount) state.withdrawAmounts[index] = totalAmount
  if (state.withdrawAmounts[index] < 1) state.withdrawAmounts[index] = 1
}

const handleClickRequestFew = async () => {
  state.loadingMenuDescription = `Requesting ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s to withdraw`
  await store.dispatch('items/requestWithdraw1155', { selectedItems: state.selectedItems, itemType: state.itemType })
  state.selectedItems = []
}

const handleClickRequestAll = async () => {
  state.loadingMenuDescription = `Requesting ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s to withdraw`
  const selectedItems = store.state.items.itemsToWithdraw.map((item, index) => Object.assign({ id: item.id, amount: state.withdrawAmounts[index] }))
  await store.dispatch('items/requestWithdraw1155', { selectedItems, itemType: state.itemType })
  state.selectedItems = []
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
      <button
        style="position: absolute; bottom: 25px; right: 20px"
        class="btn"
        :class="{ quest: store.state.items.loading }"
        :disabled="store.state.items.loading"
        @click="() => emit('handle-click-inventory-item', `order/items/${state.itemType}`)"
      >
        OrderList
      </button>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div
            class="item token"
            v-for="(item, index) in store.state.items.itemsToWithdraw"
            :key="item.id"
            :class="{ selected: isSelected(item.id) }"
          >
            <div class="token-image">
              <div class="menu-label">{{ itemRarity[item.level] }}</div>
              <img :src="`/assets/images/${state.itemType}s/${item.name}.png`" alt="no img" />
            </div>
            <div class="token-stats">
              <ul style="display: flex; flex-flow: column nowrap">
                <li class="stat">
                  Total Amount: <span class="stat-value">{{ item.amount }}</span>
                </li>
                <li class="stat" style="display: flex; align-items: center">
                  <span>Amount to Withdraw:</span>
                  <input
                    class="stat-value"
                    type="number"
                    style="width: 40px; height: 25px"
                    v-model="state.withdrawAmounts[index]"
                    @change="() => handleInputChange(index, item.amount)"
                  />
                </li>
              </ul>
              <button class="btn quest" @click="() => handleSelectItem(item.id, state.withdrawAmounts[index])">
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
            @click="handleClickRequestFew"
          >
            <span class="num-selected"
              ><span
                >Request to withdraw {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}(s) #
                {{ state.selectedItems.map(item => item.id - 100).toString() }}</span
              ></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.items.loading || store.state.items.itemsToWithdraw.length === 0 }"
            :disabled="store.state.items.loading || store.state.items.itemsToWithdraw.length === 0"
            @click="handleClickRequestAll"
          >
            Request to withdraw All
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

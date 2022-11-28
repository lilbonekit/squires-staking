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
  depositAmounts: [],
})
const menuActiveStatus = computed(() => props.inventoryItemMenuActiveStatus)
const showDepositBtn = computed(() => (state.selectedItems.length > 0 ? true : false))
const menuDescription = computed(() =>
  store.state.items.itemsToDeposit.length > 0
    ? `Select the ${state.itemType}s you would like to deposit`
    : store.state.items[`${state.itemType}Total`] > 0
    ? `All ${state.itemType}s are currently deposited!`
    : `No ${state.itemType}s to deposit`,
)

watch(menuActiveStatus, newStatus => {
  if (newStatus.slice(0, newStatus.lastIndexOf('/')) === 'deposit/items') {
    const itemType = newStatus.split('/')[2]
    state.itemType = itemType
    setTimeout(async () => {
      state.loadingMenuDescription = `Loading ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}s to Deposit`
      state.selectedItems = []
      await store.dispatch('items/getItemsToDeposit', itemType)
      state.depositAmounts = new Array(store.state.items.itemsToDeposit.length).fill(1)
    }, 750)
  }
})

const isSelected = id => (state.selectedItems.filter(item => item.id === id).length > 0 ? true : false)

const handleClickRefresh = async () => {
  state.loadingMenuDescription = `Loading ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s to Deposit`
  state.selectedItems = []
  await store.dispatch('items/getItemsToDeposit', state.itemType)
  state.depositAmounts = new Array(store.state.items.itemsToDeposit.length).fill(1)
}

const handleSelectItem = (id, amount) => {
  if (isSelected(id)) state.selectedItems = state.selectedItems.filter(item => item.id !== id)
  else state.selectedItems.push({ id, amount })
}

const handleInputChange = (index, totalAmount) => {
  if (state.depositAmounts[index] > totalAmount) state.depositAmounts[index] = totalAmount
  if (state.depositAmounts[index] < 1) state.depositAmounts[index] = 1
}

const handleClickDepositFew = async () => {
  state.loadingMenuDescription = `Depositing ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s and Prompting Metamask`
  await store.dispatch('items/depositItems', { selectedItems: state.selectedItems, itemType: state.itemType })
  state.selectedItems = []
}

const handleClickDepositAll = async () => {
  state.loadingMenuDescription = `Depositing ${state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1)}s and Prompting Metamask`
  const selectedItems = store.state.items.itemsToDeposit.map((item, index) => Object.assign({ id: item.id, amount: state.depositAmounts[index] }))
  await store.dispatch('items/depositItems', { selectedItems, itemType: state.itemType })
  state.selectedItems = []
}
</script>

<template>
  <!-- deposit items -->
  <div
    class="menu quest-menu"
    :class="{ 'menu-active': inventoryItemMenuActiveStatus.slice(0, inventoryItemMenuActiveStatus.lastIndexOf('/')) === 'deposit/items' }"
  >
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Deposit {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}s</div>
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
          <div class="item token" v-for="(item, index) in store.state.items.itemsToDeposit" :key="item.id" :class="{ selected: isSelected(item.id) }">
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
                  <span>Amount to Deposit:</span>
                  <input
                    class="stat-value"
                    type="number"
                    style="width: 40px; height: 25px"
                    v-model="state.depositAmounts[index]"
                    @change="() => handleInputChange(index, item.amount)"
                  />
                </li>
              </ul>
              <button class="btn quest" @click="() => handleSelectItem(item.id, state.depositAmounts[index])">
                {{ isSelected(item.id) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ item.id }}</span> {{ item.name }}
              </button>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.items.loading }"
            :disabled="store.state.items.loading"
            v-if="showDepositBtn"
            @click="handleClickDepositFew"
          >
            <span class="num-selected"
              ><span
                >Deposit {{ state.itemType.charAt(0).toUpperCase() + state.itemType.slice(1) }}(s) #
                {{ state.selectedItems.map(item => item.id).toString() }}</span
              ></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.items.loading || store.state.items.itemsToDeposit.length === 0 }"
            :disabled="store.state.items.loading || store.state.items.itemsToDeposit.length === 0"
            @click="handleClickDepositAll"
          >
            Deposit All
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { squiresType } from '@/config/constants/squiresType'

const store = useStore()

const props = defineProps({
  squiresMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu', 'handle-squires-menu-active-status'])

const state = reactive({
  loadingMenuDescription: 'Loading Squires to Withdraw',
  currentMenuActiveStatus: '',
  selectedSquiresId: [],
})
const menuActiveStatus = computed(() => props.squiresMenuActiveStatus)
const showWithdrawBtn = computed(() => (state.selectedSquiresId.length > 0 ? true : false))
const menuDescription = computed(() =>
  store.state.squires.squiresDeposited.length > 0
    ? 'Select the squires you would like to withdraw'
    : store.state.items.squireTotal > 0
    ? 'All squires are currently questing!'
    : 'No squires are deposited',
)
const loading = computed(() => store.state.squires.loading)

watch(menuActiveStatus, (newStatus, oldStatus) => {
  if (newStatus === 'withdraw/squires') {
    state.currentMenuActiveStatus = oldStatus
    setTimeout(() => {
      state.loadingMenuDescription = 'Loading Squires to Withdraw'
      state.selectedSquiresId = []
      store.dispatch('squires/getSquiresNoneQuesting')
    }, 750)
  }
})
watch(loading, newStatus => {
  if (!newStatus) {
    state.selectedSquiresId = []
    store.commit('squires/setSquiresIdToWithdraw', [])
  }
})

const isSelected = id => (state.selectedSquiresId.filter(squireId => squireId === id).length > 0 ? true : false)

const handleClickRefresh = () => {
  state.loadingMenuDescription = 'Loading Squires to Withdraw'
  state.selectedSquiresId = []
  store.dispatch('squires/getSquiresNoneQuesting')
}

const handleSelectSquire = id => {
  if (isSelected(id)) state.selectedSquiresId = state.selectedSquiresId.filter(squireId => squireId !== id)
  else state.selectedSquiresId.push(id)
}

const handleClickWithdrawFew = () => {
  state.loadingMenuDescription = 'Withdrawing Squires and Prompting Metamask'
  store.commit('squires/setSquiresIdToWithdraw', state.selectedSquiresId)
  store.dispatch('squires/requestWithdrawOrders')
}

const handleClickWithdrawAll = () => {
  state.loadingMenuDescription = 'Withdrawing Squires and Prompting Metamask'
  const selectedSquiresId = store.state.squires.squiresDeposited.map(squire => squire.tokenId)
  store.commit('squires/setSquiresIdToWithdraw', selectedSquiresId)
  store.dispatch('squires/requestWithdrawOrders')
}
</script>

<template>
  <!-- withdraw -->
  <div class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'withdraw/squires' }">
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Withdraw Squires</div>
      <p class="menu-description">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ menuDescription }}
        </template>
      </p>
      <button
        class="btn"
        :class="{ quest: store.state.squires.loading }"
        :disabled="store.state.squires.loading"
        @click="() => emit('handle-squires-menu-active-status', state.currentMenuActiveStatus)"
      >
        Check Squires in Town
      </button>
      <button class="btn" :class="{ quest: store.state.squires.loading }" :disabled="store.state.squires.loading" @click="() => handleClickRefresh()">
        Refresh
      </button>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div
            class="item token"
            v-for="squire in store.state.squires.squiresDeposited"
            :key="squire.tokenId"
            :class="{ selected: isSelected(squire.tokenId) }"
          >
            <div class="token-image">
              <div class="menu-label">{{ squiresType[squire.type].typeName }}</div>
              <img :src="squiresType[squire.type].image" alt="no img" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  <i class="stat-icon"><img src="/assets/images/kote-icon-axe.png" /></i>Strength:
                  <span class="stat-value">{{ squire.strength }}</span>
                </li>
                <li class="stat">
                  <i class="stat-icon"><img src="/assets/images/kote-icon-jewel.png" /></i>Luck:
                  <span class="stat-value">{{ squire.luck }}</span>
                </li>
                <li class="stat">
                  <i class="stat-icon"><img src="/assets/images/kote-icon-sparkle.png" /></i>Wisdom:
                  <span class="stat-value">{{ squire.wisdom }}</span>
                </li>
                <li class="stat">
                  <i class="stat-icon"><img src="/assets/images/kote-icon-staff.png" /></i>Faith:
                  <span class="stat-value">{{ squire.faith }}</span>
                </li>
              </ul>
              <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)">
                {{ isSelected(squire.tokenId) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ squire.tokenId }}</span>
              </button>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            v-if="showWithdrawBtn"
            @click="handleClickWithdrawFew"
          >
            <span class="num-selected"
              ><span>Withdraw Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading || store.state.squires.squiresDeposited.length === 0 }"
            :disabled="store.state.squires.loading || store.state.squires.squiresDeposited.length === 0"
            @click="handleClickWithdrawAll"
          >
            Withdraw All
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

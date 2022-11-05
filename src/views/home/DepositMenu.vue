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
  currentMenuActiveStatus: '',
  selectedSquiresId: [],
})
const menuActiveStatus = computed(() => props.squiresMenuActiveStatus)
const showDepositBtn = computed(() => (state.selectedSquiresId.length > 0 ? true : false))
const menuDescription = computed(() =>
  store.state.squires.squiresToDeposit.length > 0
    ? 'Select the squires you would like to deposit'
    : store.state.items.squireTotal > 0
    ? 'All squires are currently deposited!'
    : 'No squires to deposit',
)

watch(menuActiveStatus, (newStatus, oldStatus) => {
  if (newStatus === 'deposit') {
    state.currentMenuActiveStatus = oldStatus
    setTimeout(() => {
      state.selectedSquiresId = []
      store.dispatch('squires/getSquiresToDeposit')
    }, 750)
  }
})

const isSelected = id => (state.selectedSquiresId.filter(squireId => squireId === id).length > 0 ? true : false)

const handleClickRefresh = async () => {
  state.selectedSquiresId = []
  await store.dispatch('squires/getSquiresToDeposit')
}

const handleSelectSquire = id => {
  if (isSelected(id)) state.selectedSquiresId = state.selectedSquiresId.filter(squireId => squireId !== id)
  else state.selectedSquiresId.push(id)
}

const handleClickDepositFew = async () => {
  if (state.selectedSquiresId.length > 0) {
    await store.dispatch('squires/depositSquires', state.selectedSquiresId)
    state.selectedSquiresId = []
  }
}

const handleClickDepositAll = async () => {
  const selectedSquiresId = store.state.squires.squiresToDeposit.map(squire => squire.id)
  await store.dispatch('squires/depositSquires', selectedSquiresId)
  state.selectedSquiresId = []
}
</script>

<template>
  <!-- deposit -->
  <div class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'deposit' }">
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Deposit Squires</div>
      <p class="menu-description">
        <template v-if="store.state.squires.loading">
          Loading Squires<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ menuDescription }}
        </template>
      </p>
      <button class="btn" @click="() => emit('handle-squires-menu-active-status', state.currentMenuActiveStatus)">Check Squires Deposited</button>
      <button class="btn" @click="() => handleClickRefresh()">Refresh</button>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresToDeposit">
            <div class="item token" :class="{ selected: isSelected(squire.id) }">
              <div class="token-image">
                <div class="menu-label">{{ squiresType[squire.type || 1].typeName }}</div>
                <img :src="squiresType[squire.type || 1].image" alt="no img" />
              </div>
              <div class="token-stats">
                <ul>
                  <li class="stat">
                    <i class="stat-icon"><img src="/assets/images/kote-icon-axe.png" /></i>Strength:
                    <span class="stat-value">{{ squire.strength || 6 }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="/assets/images/kote-icon-jewel.png" /></i>Luck:
                    <span class="stat-value">{{ squire.luck || 4 }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="/assets/images/kote-icon-sparkle.png" /></i>Wisdom:
                    <span class="stat-value">{{ squire.wisdom || 4 }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="/assets/images/kote-icon-staff.png" /></i>Faith:
                    <span class="stat-value">{{ squire.faith || 4 }}</span>
                  </li>
                </ul>
                <button class="btn quest" @click="() => handleSelectSquire(squire.id)">
                  {{ isSelected(squire.id) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ squire.id }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            v-if="showDepositBtn"
            @click="handleClickDepositFew"
          >
            <span class="num-selected"
              ><span>Deposit Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button class="btn" :class="{ quest: store.state.squires.loading }" :disabled="store.state.squires.loading" @click="handleClickDepositAll">
            Deposit All
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

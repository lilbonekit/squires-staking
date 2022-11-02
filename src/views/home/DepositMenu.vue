<script setup>
import { reactive, watch, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  squiresMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu', 'handle-squires-menu-active-status'])

const state = reactive({
  currentMenuActiveStatus: '',
  selectedSquires: [],
})
const menuActiveStatus = computed(() => props.squiresMenuActiveStatus)
const showDepositBtn = computed(() => (state.selectedSquires.length > 0 ? true : false))

watch(menuActiveStatus, (newStatus, oldStatus) => {
  if (newStatus === 'deposit') {
    state.currentMenuActiveStatus = oldStatus
    setTimeout(() => {
      store.dispatch('squires/squiresNonDeposit')
    }, 750)
  }
})

const isSelected = id => (state.selectedSquires.filter(squire => squire === id).length > 0 ? true : false)

const handleClickClose = () => {
  setTimeout(() => {
    state.selectedSquires = []
  }, 750)
  emit('handle-click-close-menu')
}

const handleCheckDeposited = () => {
  setTimeout(() => {
    state.selectedSquires = []
  }, 750)
  emit('handle-squires-menu-active-status', state.currentMenuActiveStatus)
}

const handleClickRefresh = async () => {
  state.selectedSquires = []
  await store.dispatch('squires/squiresNonDeposit')
}

const handleSelectSquire = id => {
  if (isSelected(id)) state.selectedSquires = state.selectedSquires.filter(squire => squire !== id)
  else state.selectedSquires.push(id)
}

const handleSelectDepositFew = () => {}

const handleSelectDepositAll = () => {}
</script>

<template>
  <!-- deposit -->
  <div class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'deposit' }">
    <header class="menu-header">
      <button class="close-menu" @click="() => handleClickClose()"></button>
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
          {{ store.state.squires.data.length === 0 ? 'All squires are currently deposited!' : 'Select the squires you would like to deposit' }}
        </template>
      </p>
      <button class="btn" @click="() => handleCheckDeposited()">Check Squires Deposited</button>
      <button class="btn" @click="() => handleClickRefresh()">Refresh</button>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.data">
            <div class="item token" :class="{ selected: isSelected(squire.id) }">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename || 'Strength' }}</div>
                <img src="/assets/images/strength.png" alt="no img" />
              </div>
              <div class="token-stats">
                <ul>
                  <li class="stat">
                    <i class="stat-icon"><img src="/assets/images/kote-icon-axe.png" /></i>Strength:
                    <span class="stat-value">{{ squire.strength || 3 }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="/assets/images/kote-icon-jewel.png" /></i>Luck:
                    <span class="stat-value">{{ squire.luck || 1 }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="/assets/images/kote-icon-sparkle.png" /></i>Wisdom:
                    <span class="stat-value">{{ squire.wisdom || 2 }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="/assets/images/kote-icon-staff.png" /></i>Faith:
                    <span class="stat-value">{{ squire.faith || 1 }}</span>
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
          <button class="btn" v-if="showDepositBtn" @click="handleSelectDepositFew">
            <span class="num-selected"
              ><span id="questorsF">Deposit Squire(s) # {{ state.selectedSquires.toString() }}</span></span
            >
          </button>
          <button class="btn" @click="handleSelectDepositAll">Deposit All</button>
        </footer>
      </div>
    </main>
  </div>
</template>

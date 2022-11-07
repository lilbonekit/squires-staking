<script setup>
import { watch, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { squiresType } from '@/config/constants/squiresType'

const store = useStore()

const props = defineProps({
  squiresMenuActiveStatus: String,
})

const emit = defineEmits(['handle-click-close-menu', 'handle-squires-menu-active-status'])

const state = reactive({
  selectedSquiresId: [],
  loadingMenuDescription: 'Loading Squires',
  timeNow: Math.floor(Date.now() / 1000),
})

const menuActiveStatus = computed(() => props.squiresMenuActiveStatus)
const showSendBtn = computed(() => (state.selectedSquiresId.length > 0 ? true : false))
const sendMenuDescription = computed(() =>
  store.state.squires.squiresDeposited.length > 0
    ? 'Select the squires you would like to send off questing'
    : store.state.items.squireTotal > 0
    ? 'All squires are currently questing!'
    : 'No squires are deposited',
)
const returnMenuDescription = computed(() =>
  store.state.squires.squiresDeposited.length > 0
    ? 'Select the squires you would like to return from questing'
    : 'No squires are currently questing!',
)
const lootData = computed(() => store.state.squires.loot)

watch(menuActiveStatus, newStatus => {
  if (newStatus === 'forest/send' || newStatus === 'mountain/send' || newStatus === 'cavern/send' || newStatus === 'temple/send')
    setTimeout(() => {
      state.loadingMenuDescription = 'Loading Squires'
      state.selectedSquiresId = []
      store.dispatch('squires/getSquiresNoneQuesting')
    }, 750)
  if (newStatus === 'forest/return')
    setTimeout(() => {
      state.loadingMenuDescription = 'Loading Questing Squires in Forest'
      state.selectedSquiresId = []
      store.dispatch('squires/getSquiresQuestingForest')
      state.timeNow = Math.floor(Date.now() / 1000)
    }, 750)
  if (newStatus === 'mountain/return')
    setTimeout(() => {
      state.loadingMenuDescription = 'Loading Questing Squires in Mountain'
      state.selectedSquiresId = []
      store.dispatch('squires/getSquiresQuestingMountain')
      state.timeNow = Math.floor(Date.now() / 1000)
    }, 750)
  if (newStatus === 'cavern/return')
    setTimeout(() => {
      state.loadingMenuDescription = 'Loading Questing Squires in Cavern'
      state.selectedSquiresId = []
      store.dispatch('squires/getSquiresQuestingCavern')
      state.timeNow = Math.floor(Date.now() / 1000)
    }, 750)
  if (newStatus === 'temple/return')
    setTimeout(() => {
      state.loadingMenuDescription = 'Loading Questing Squires in Temple'
      state.selectedSquiresId = []
      store.dispatch('squires/getSquiresQuestingTemple')
      state.timeNow = Math.floor(Date.now() / 1000)
    }, 750)
})

watch(lootData, newData => {
  if (newData.length > 0) {
    emit('handle-squires-menu-active-status', 'loot')
  }
})

const isSelected = id => (state.selectedSquiresId.filter(squireId => squireId === id).length > 0 ? true : false)

const handleClickRefresh = async (dispatchType, loadingMessage) => {
  state.loadingMenuDescription = loadingMessage
  state.selectedSquiresId = []
  await store.dispatch(dispatchType)
}

const handleSelectSquire = id => {
  if (isSelected(id)) state.selectedSquiresId = state.selectedSquiresId.filter(squireId => squireId !== id)
  else state.selectedSquiresId.push(id)
}

const handleClickSendFew = async questType => {
  if (state.selectedSquiresId.length > 0) {
    state.loadingMenuDescription = `Sending Squires to the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
    await store.dispatch('squires/startQuest', { questType, selectedSquiresId: state.selectedSquiresId })
    state.selectedSquiresId = []
  }
}

const handleClickSendAll = async questType => {
  state.loadingMenuDescription = `Sending Squires to the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  const selectedSquiresId = store.state.squires.squiresDeposited.map(squire => squire.tokenId)
  await store.dispatch('squires/startQuest', { questType, selectedSquiresId })
  state.selectedSquiresId = []
}

const handleClickReturnFew = async questType => {
  if (state.selectedSquiresId.length > 0) {
    state.loadingMenuDescription = `Returning Squires and Gathering Rewards from the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
    store.commit('squires/setIsRestart', false)
    await store.dispatch('squires/finishQuest', { questType, selectedSquiresId: state.selectedSquiresId })
    state.selectedSquiresId = []
  }
}

const handleClickReturnAll = async questType => {
  console.log(store.state.squires.squiresDeposited)
  state.loadingMenuDescription = `Returning Squires and Gathering Rewards from the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  store.commit('squires/setIsRestart', false)
  const selectedSquiresId = store.state.squires.squiresDeposited.map(squire => squire.tokenId)
  await store.dispatch('squires/finishQuest', { questType, selectedSquiresId })
  state.selectedSquiresId = []
}

const handleClickReturnAllandRestart = async questType => {
  state.loadingMenuDescription = `Returning Squires and Gathering Rewards from the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  store.commit('squires/setIsRestart', true)
  const selectedSquiresId = store.state.squires.squiresDeposited.map(squire => squire.tokenId)
  await store.dispatch('squires/finishQuest', { questType, selectedSquiresId })
  await store.dispatch('squires/startQuest', { questType, selectedSquiresId })
  if (questType === 'forest') store.dispatch('squires/getSquiresQuestingForest')
  if (questType === 'mountain') store.dispatch('squires/getSquiresQuestingMountain')
  if (questType === 'cavern') store.dispatch('squires/getSquiresQuestingCavern')
  if (questType === 'temple') store.dispatch('squires/getSquiresQuestingTemple')
  state.selectedSquiresId = []
}
</script>

<template>
  <!-- forest -->
  <div id="Forest-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'forest/send' }">
    <header class="menu-header">
      <button id="Close-Forest-Send" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Forest</div>
      <p class="menu-description" id="Forest-Description-Send">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ sendMenuDescription }}
        </template>
      </p>
      <button id="Forest-return" class="btn" @click="() => emit('handle-squires-menu-active-status', 'forest/return')">
        Check Squires Ready to Return
      </button>
      <button id="refresh-return-forest" class="btn" @click="() => handleClickRefresh('squires/getSquiresNoneQuesting', 'Loading Squires')">
        Refresh
      </button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => emit('handle-squires-menu-active-status', 'deposit')">
        Deposit
      </button>
    </header>
    <main id="Forest-Console-Send" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresDeposited">
            <div class="item token" :class="{ selected: isSelected(squire.tokenId) }">
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
                <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)">
                  {{ isSelected(squire.tokenId) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ squire.tokenId }}</span>
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
            v-if="showSendBtn"
            @click="() => handleClickSendFew('forest')"
          >
            <span class="num-selected"
              ><span>Send Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickSendAll('forest')"
          >
            Send All
          </button>
        </footer>
      </div>
    </main>
  </div>

  <div id="Forest-Menu__Return" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'forest/return' }">
    <header class="menu-header">
      <button id="Close-Forest-Return" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Forest</div>
      <p class="menu-description" id="Forest-Description-Return">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ returnMenuDescription }}
        </template>
      </p>
      <p class="menu-description" id="Forest-Description-Returning" style="display: none">
        Returning Squires and Gathering Rewards<br /><img
          class="menu-description"
          style="width: 25%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        /><br /><i style="color: grey">Gathering rewards can take up to 3 minutes</i>
      </p>
      <button id="Forest-quest" class="btn" @click="() => emit('handle-squires-menu-active-status', 'forest/send')">
        Check Squires Ready to Quest
      </button>
      <p id="Forest-message" class="menu-description" style="color: grey; text-size: 20px">
        *If you can't see your squires, hit <i>refresh</i> below
      </p>
      <button
        id="refresh-quest-forest"
        class="btn"
        @click="() => handleClickRefresh('squires/getSquiresQuestingForest', 'Loading Questing Squires in Forest')"
      >
        Refresh
      </button>
    </header>
    <main id="Forest-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresDeposited">
            <div class="item token" :class="{ selected: isSelected(squire.tokenId) }">
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
                <button class="btn quest" v-if="squire.finish - state.timeNow > 0">
                  <span class="token-number"
                    >#{{ squire.tokenId }} is still questing:
                    <span> {{ new Date((squire.finish - state.timeNow) * 1000).toISOString().substring(11, 8) }} </span></span
                  >
                </button>
                <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)" v-else>
                  <span class="token-number">#{{ squire.tokenId }} is ready to return</span>
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
            v-if="showSendBtn"
            @click="() => handleClickReturnFew('forest')"
          >
            <span class="num-selected"
              ><span>Return Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickReturnAll('forest')"
          >
            Return All
          </button>
        </footer>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickReturnAllandRestart('forest')"
          >
            Return All and Restart Quest
          </button>
        </footer>
      </div>
    </main>
  </div>
  <!-- mountain -->
  <div id="Mountain-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'mountain/send' }">
    <header class="menu-header">
      <button id="Close-Mountain-Send" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Mountain</div>
      <p class="menu-description" id="Mountain-Description-Send">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ sendMenuDescription }}
        </template>
      </p>
      <button id="Mountain-return" class="btn" @click="() => emit('handle-squires-menu-active-status', 'mountain/return')">
        Check Squires Ready to Return
      </button>
      <button id="refresh-return-mountain" class="btn" @click="() => handleClickRefresh('squires/getSquiresNoneQuesting', 'Loading Squires')">
        Refresh
      </button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => emit('handle-squires-menu-active-status', 'deposit')">
        Deposit
      </button>
    </header>
    <main id="Mountain-Console-Send" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresDeposited">
            <div class="item token" :class="{ selected: isSelected(squire.tokenId) }">
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
                <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)">
                  {{ isSelected(squire.tokenId) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ squire.tokenId }}</span>
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
            v-if="showSendBtn"
            @click="() => handleClickSendFew('mountain')"
          >
            <span class="num-selected"
              ><span>Send Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickSendAll('mountain')"
          >
            Send All
          </button>
        </footer>
      </div>
    </main>
  </div>

  <div id="Mountain-Menu__Return" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'mountain/return' }">
    <header class="menu-header">
      <button id="Close-Mountain-Return" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Mountain</div>
      <p class="menu-description" id="Mountain-Description-Return">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ returnMenuDescription }}
        </template>
      </p>
      <p class="menu-description" id="Mountain-Description-Returning" style="display: none">
        Returning Squires and Gathering Rewards<br /><img
          class="menu-description"
          style="width: 25%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        /><br /><i style="color: grey">Gathering rewards can take up to 3 minutes</i>
      </p>
      <button id="Mountain-quest" class="btn" @click="() => emit('handle-squires-menu-active-status', 'mountain/send')">
        Check Squires Ready to Quest
      </button>
      <p id="Mountain-message" class="menu-description" style="color: grey; text-size: 20px">
        *If you can't see your squires, hit <i>refresh</i> below
      </p>
      <button
        id="refresh-quest-mountain"
        class="btn"
        @click="() => handleClickRefresh('squires/getSquiresQuestingMountain', 'Loading Questing Squires in Mountain')"
      >
        Refresh
      </button>
    </header>
    <main id="Mountain-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresDeposited">
            <div class="item token" :class="{ selected: isSelected(squire.tokenId) }">
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
                <button class="btn quest" v-if="squire.finish - state.timeNow > 0">
                  <span class="token-number"
                    >#{{ squire.tokenId }} is still questing:
                    <span> {{ new Date((squire.finish - state.timeNow) * 1000).toISOString().substring(11, 8) }} </span></span
                  >
                </button>
                <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)" v-else>
                  <span class="token-number">#{{ squire.tokenId }} is ready to return</span>
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
            v-if="showSendBtn"
            @click="() => handleClickReturnFew('mountain')"
          >
            <span class="num-selected"
              ><span>Return Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickReturnAll('mountain')"
          >
            Return All
          </button>
        </footer>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickReturnAllandRestart('mountain')"
          >
            Return All and Restart Quest
          </button>
        </footer>
      </div>
    </main>
  </div>

  <!-- cavern -->
  <div id="Cavern-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'cavern/send' }">
    <header class="menu-header">
      <button id="Close-Cavern-Send" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Cavern</div>
      <p class="menu-description" id="Cavern-Description-Send">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ sendMenuDescription }}
        </template>
      </p>
      <button id="Cavern-return" class="btn" @click="() => emit('handle-squires-menu-active-status', 'cavern/return')">
        Check Squires Ready to Return
      </button>
      <button id="refresh-return-cavern" class="btn" @click="() => handleClickRefresh('squires/getSquiresNoneQuesting', 'Loading Squires')">
        Refresh
      </button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => emit('handle-squires-menu-active-status', 'deposit')">
        Deposit
      </button>
    </header>
    <main id="Cavern-Console-Send" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresDeposited">
            <div class="item token" :class="{ selected: isSelected(squire.tokenId) }">
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
                <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)">
                  {{ isSelected(squire.tokenId) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ squire.tokenId }}</span>
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
            v-if="showSendBtn"
            @click="() => handleClickSendFew('cavern')"
          >
            <span class="num-selected"
              ><span>Send Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickSendAll('cavern')"
          >
            Send All
          </button>
        </footer>
      </div>
    </main>
  </div>

  <div id="Cavern-Menu__Return" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'cavern/return' }">
    <header class="menu-header">
      <button id="Close-Cavern-Return" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Cavern</div>
      <p class="menu-description" id="Cavern-Description-Return">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ returnMenuDescription }}
        </template>
      </p>
      <p class="menu-description" id="Cavern-Description-Returning" style="display: none">
        Returning Squires and Gathering Rewards<br /><img
          class="menu-description"
          style="width: 25%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        /><br /><i style="color: grey">Gathering rewards can take up to 3 minutes</i>
      </p>
      <button id="Cavern-quest" class="btn" @click="() => emit('handle-squires-menu-active-status', 'cavern/send')">
        Check Squires Ready to Quest
      </button>
      <p id="Cavern-message" class="menu-description" style="color: grey; text-size: 20px">
        *If you can't see your squires, hit <i>refresh</i> below
      </p>
      <button
        id="refresh-quest-cavern"
        class="btn"
        @click="() => handleClickRefresh('squires/getSquiresQuestingCavern', 'Loading Questing Squires in Cavern')"
      >
        Refresh
      </button>
    </header>
    <main id="Cavern-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresDeposited">
            <div class="item token" :class="{ selected: isSelected(squire.tokenId) }">
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
                <button class="btn quest" v-if="squire.finish - state.timeNow > 0">
                  <span class="token-number"
                    >#{{ squire.tokenId }} is still questing:
                    <span> {{ new Date((squire.finish - state.timeNow) * 1000).toISOString().substring(11, 8) }} </span></span
                  >
                </button>
                <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)" v-else>
                  <span class="token-number">#{{ squire.tokenId }} is ready to return</span>
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
            v-if="showSendBtn"
            @click="() => handleClickReturnFew('cavern')"
          >
            <span class="num-selected"
              ><span>Return Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickReturnAll('cavern')"
          >
            Return All
          </button>
        </footer>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickReturnAllandRestart('cavern')"
          >
            Return All and Restart Quest
          </button>
        </footer>
      </div>
    </main>
  </div>

  <!-- temple -->
  <div id="Temple-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'temple/send' }">
    <header class="menu-header">
      <button id="Close-Temple-Send" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Temple</div>
      <p class="menu-description" id="Temple-Closed">Temple is closed until the next day of worship.<br /><br />You can return your Squires Only</p>
      <p class="menu-description" id="Temple-Description-Send">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ sendMenuDescription }}
        </template>
      </p>
      <button id="Temple-return" class="btn" @click="() => emit('handle-squires-menu-active-status', 'temple/return')">
        Check Squires Ready to Return
      </button>
      <button id="refresh-return-temple" class="btn" @click="() => handleClickRefresh('squires/getSquiresNoneQuesting', 'Loading Squires')">
        Refresh
      </button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => emit('handle-squires-menu-active-status', 'deposit')">
        Deposit
      </button>
    </header>
    <main id="Temple-Console-Send" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresDeposited">
            <div class="item token" :class="{ selected: isSelected(squire.tokenId) }">
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
                <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)">
                  {{ isSelected(squire.tokenId) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ squire.tokenId }}</span>
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
            v-if="showSendBtn"
            @click="() => handleClickSendFew('temple')"
          >
            <span class="num-selected"
              ><span>Send Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickSendAll('temple')"
          >
            Send All
          </button>
        </footer>
      </div>
    </main>
  </div>

  <div id="Temple-Menu__Return" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'temple/return' }">
    <header class="menu-header">
      <button id="Close-Temple-Return" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Temple</div>
      <p class="menu-description" id="Temple-Description-Return">
        <template v-if="store.state.squires.loading">
          {{ state.loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{ returnMenuDescription }}
        </template>
      </p>
      <p class="menu-description" id="Temple-Description-Returning" style="display: none">
        Returning Squires and Gathering Rewards<br /><img
          class="menu-description"
          style="width: 25%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        /><br /><i style="color: grey">Gathering rewards can take up to 3 minutes</i>
      </p>
      <button id="Temple-quest" class="btn" @click="() => emit('handle-squires-menu-active-status', 'temple/send')">
        Check Squires Ready to Quest
      </button>
      <p id="Temple-message" class="menu-description" style="color: grey; text-size: 20px">
        *If you can't see your squires, hit <i>refresh</i> below
      </p>
      <button
        id="refresh-quest-temple"
        class="btn"
        @click="() => handleClickRefresh('squires/getSquiresQuestingTemple', 'Loading Questing Squires in Temple')"
      >
        Refresh
      </button>
    </header>
    <main id="Temple-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div v-for="squire in store.state.squires.squiresDeposited">
            <div class="item token" :class="{ selected: isSelected(squire.tokenId) }">
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
                <button class="btn quest" v-if="squire.finish - state.timeNow > 0">
                  <span class="token-number"
                    >#{{ squire.tokenId }} is still questing:
                    <span> {{ new Date((squire.finish - state.timeNow) * 1000).toISOString().substring(11, 8) }} </span></span
                  >
                </button>
                <button class="btn quest" @click="() => handleSelectSquire(squire.tokenId)" v-else>
                  <span class="token-number">#{{ squire.tokenId }} is ready to return</span>
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
            v-if="showSendBtn"
            @click="() => handleClickReturnFew('temple')"
          >
            <span class="num-selected"
              ><span>Return Squire(s) # {{ state.selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickReturnAll('temple')"
          >
            Return All
          </button>
        </footer>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: store.state.squires.loading }"
            :disabled="store.state.squires.loading"
            @click="() => handleClickReturnAllandRestart('temple')"
          >
            Return All and Restart Quest
          </button>
        </footer>
      </div>
    </main>
  </div>

  <!--Town-->
  <div id="Town-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'town/send' }">
    <header class="menu-header">
      <button id="Close-Town" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Town</div>
      <p class="menu-description">Currently closed for repairs.</p>
    </header>
  </div>

  <!--Jeweler-->
  <div id="Jeweler-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'jeweler/send' }">
    <header class="menu-header">
      <button id="Close-Jeweler" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Jeweler</div>
      <p class="menu-description">Currently closed for repairs.</p>
    </header>
  </div>

  <!--Blacksmith-->
  <div id="Blacksmith-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'blacksmith/send' }">
    <header class="menu-header">
      <button id="Close-Blacksmith" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Blacksmith</div>
      <p class="menu-description">Currently closed for repairs.</p>
    </header>
  </div>

  <!--Alchemist-->
  <div id="Alchemist-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'alchemist/send' }">
    <header class="menu-header">
      <button id="Close-Alchemist" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Alchemist</div>
      <p class="menu-description">Currently closed for repairs.</p>
    </header>
  </div>
</template>

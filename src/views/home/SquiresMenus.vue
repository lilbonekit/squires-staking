<script setup>
import { watch, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { questTypes } from '@/config/constants/questTypes'
import { repairTypes } from '@/config/constants/repairTypes'
import SendMenu from './SendMenu.vue'
import ReturnMenu from './ReturnMenu.vue'
import RepairMenu from './RepairMenu.vue'

const store = useStore()

const props = defineProps({
  squiresMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu', 'handle-squires-menu-active-status'])

const state = reactive({
  selectedSquiresId: [],
  loadingMenuDescription: 'Loading Squires',
  timeNow: Math.floor(Date.now() / 1000) - 20,
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
  if (String(newStatus).split('/')[1] === 'send')
    setTimeout(() => {
      state.loadingMenuDescription = 'Loading Squires'
      state.selectedSquiresId = []
      store.dispatch('squires/getSquiresNoneQuesting')
    }, 750)
  if (String(newStatus).split('/')[1] === 'return') {
    const questType = String(newStatus).split('/')[0]
    setTimeout(() => {
      state.loadingMenuDescription = `Loading Questing Squires in ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
      state.selectedSquiresId = []
      state.timeNow = Math.floor(Date.now() / 1000) - 20
      store.dispatch('squires/getSquiresQuesting', questType)
    }, 750)
  }
})

watch(lootData, newData => {
  emit('handle-squires-menu-active-status', 'loot')
})

const isSelected = id => (state.selectedSquiresId.filter(squireId => squireId === id).length > 0 ? true : false)

const handleClickRefreshNQ = () => {
  state.loadingMenuDescription = 'Loading Squires'
  state.selectedSquiresId = []
  store.dispatch('squires/getSquiresNoneQuesting')
}

const handleClickRefreshQ = questType => {
  state.loadingMenuDescription = `Loading Questing Squires in ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  state.selectedSquiresId = []
  state.timeNow = Math.floor(Date.now() / 1000) - 20
  store.dispatch('squires/getSquiresQuesting', questType)
}

const handleSelectSquire = id => {
  if (isSelected(id)) state.selectedSquiresId = state.selectedSquiresId.filter(squireId => squireId !== id)
  else state.selectedSquiresId.push(id)
}

const handleClickSendFew = async questType => {
  state.loadingMenuDescription = `Sending Squires to the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  await store.dispatch('squires/startQuest', { questType, selectedSquiresId: state.selectedSquiresId })
  state.selectedSquiresId = []
}

const handleClickSendAll = async questType => {
  state.loadingMenuDescription = `Sending Squires to the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  const selectedSquiresId = store.state.squires.squiresDeposited.map(squire => squire.tokenId)
  await store.dispatch('squires/startQuest', { questType, selectedSquiresId })
  state.selectedSquiresId = []
}

const handleClickReturnFew = async questType => {
  state.loadingMenuDescription = `Returning Squires and Gathering Rewards from the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  store.commit('squires/setIsRestart', false)
  await store.dispatch('squires/finishQuest', { questType, selectedSquiresId: state.selectedSquiresId })
  state.selectedSquiresId = []
}

const checkStillQuesting = () => {
  const stillQuestingSquires = store.state.squires.squiresDeposited.filter(squire => squire.finish - state.timeNow > 0)
  return stillQuestingSquires.length > 0 ? true : false
}

const handleClickReturnAll = async questType => {
  if (checkStillQuesting() === true) return
  state.loadingMenuDescription = `Returning Squires and Gathering Rewards from the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  store.commit('squires/setIsRestart', false)
  const selectedSquiresId = store.state.squires.squiresDeposited.map(squire => squire.tokenId)
  await store.dispatch('squires/finishQuest', { questType, selectedSquiresId })
  state.selectedSquiresId = []
}

const handleClickReturnAllandRestart = async questType => {
  if (checkStillQuesting() === true) return
  state.loadingMenuDescription = `Returning Squires and Gathering Rewards from the ${questType.charAt(0).toUpperCase() + questType.slice(1)}`
  store.commit('squires/setIsRestart', true)
  const selectedSquiresId = store.state.squires.squiresDeposited.map(squire => squire.tokenId)
  await store.dispatch('squires/finishQuest', { questType, selectedSquiresId })
  await store.dispatch('squires/startQuest', { questType, selectedSquiresId })
  await store.dispatch('squires/getSquiresQuesting', questType)
  state.selectedSquiresId = []
}
</script>

<template>
  <!-- Send Menus -->
  <send-menu
    v-for="(questType, index) in questTypes"
    :key="index"
    :quest-type="questType"
    :squires-menu-active-status="squiresMenuActiveStatus"
    :loading="store.state.squires.loading"
    :loading-menu-description="state.loadingMenuDescription"
    :send-menu-description="sendMenuDescription"
    :squires-deposited="store.state.squires.squiresDeposited"
    :selected-squires-id="state.selectedSquiresId"
    :is-selected="isSelected"
    :show-send-btn="showSendBtn"
    @handle-click-close-menu="() => emit('handle-click-close-menu')"
    @handle-squires-menu-active-status="status => emit('handle-squires-menu-active-status', status)"
    @handle-click-refresh="handleClickRefreshNQ"
    @handle-select-squire="handleSelectSquire"
    @handle-click-send-few="handleClickSendFew"
    @handle-click-send-all="handleClickSendAll"
  />

  <!-- Return Menus -->
  <return-menu
    v-for="(questType, index) in questTypes"
    :key="index"
    :quest-type="questType"
    :squires-menu-active-status="squiresMenuActiveStatus"
    :loading="store.state.squires.loading"
    :loading-menu-description="state.loadingMenuDescription"
    :return-menu-description="returnMenuDescription"
    :time-now="state.timeNow"
    :squires-deposited="store.state.squires.squiresDeposited"
    :selected-squires-id="state.selectedSquiresId"
    :is-selected="isSelected"
    :show-send-btn="showSendBtn"
    @handle-click-close-menu="() => emit('handle-click-close-menu')"
    @handle-squires-menu-active-status="status => emit('handle-squires-menu-active-status', status)"
    @handle-click-refresh="handleClickRefreshQ"
    @handle-select-squire="handleSelectSquire"
    @handle-click-return-few="handleClickReturnFew"
    @handle-click-return-all="handleClickReturnAll"
    @handle-click-return-all-and-restart="handleClickReturnAllandRestart"
  />

  <!-- Repair Menus -->
  <repair-menu
    v-for="(repairType, index) in repairTypes"
    :key="index"
    :repair-type="repairType"
    :squires-menu-active-status="squiresMenuActiveStatus"
    @handle-click-close-menu="() => emit('handle-click-close-menu')"
  />
</template>

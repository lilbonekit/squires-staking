<script setup>
import { onMounted, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Loader from '@/components/Loader.vue'
import Gate from '@/views/home/Gate.vue'
import World from '@/views/home/World.vue'
import Menus from '@/views/home/Menus.vue'
import ApproveMenus from '@/views/home/ApproveMenus.vue'
import InventoryMenu from '@/views/home/InventoryMenu.vue'
import DepositSquiresMenu from '@/views/home/DepositSquiresMenu.vue'
import DepositFiefMenu from '@/views/home/DepositFiefMenu.vue'
import DepositItemsMenu from '@/views/home/DepositItemsMenu.vue'
import SquiresMenus from '@/views/home/SquiresMenus.vue'
import AboutMenus from '@/views/home/AboutMenus.vue'
import InventoryItemMenus from '@/views/home/InventoryItemMenus.vue'
import LootMenu from '@/views/home/LootMenu.vue'

const store = useStore()
const router = useRouter()

const state = reactive({
  loading: true,
  mouseHovered: false,
  gateOpen: true,
  enteredGate: false,
  gateBtnShow: true,
  gateShow: true,
  showFog: true,
  showMenus: false,
  mapRegionActive: '',
  inventoryMenuReady: false,
  squiresMenuActiveStatus: '',
  aboutMenuActiveStatus: '',
  inventoryItemMenuActiveStatus: '',
})

const homePageLoading = computed(() => store.state.homePageLoading)
const isHoverClass = computed(() => (!state.gateOpen && state.mouseHovered ? true : false))
const isWrongNetwork = computed(() => (store.state.web3.chainId !== 5 ? true : false))
const isGateOpen = computed(() => (state.gateOpen ? true : false))
const disconnectedWallet = computed(() => (store.state.web3.active ? false : true))
const changedAccount = computed(() => store.state.web3.account)

watch(isWrongNetwork, newStatus => {
  if (newStatus === true) state.gateOpen = false
  else state.gateOpen = true
})

watch(isGateOpen, newStatus => {
  if (newStatus === false) {
    state.showFog = true
    state.showMenus = false
    state.enteredGate = false
    state.inventoryMenuReady = false
    state.squiresMenuActiveStatus = ''
    state.aboutMenuActiveStatus = ''
    state.inventoryItemMenuActiveStatus = ''
    setTimeout(() => {
      state.gateBtnShow = true
    }, 500)
    setTimeout(() => {
      state.gateShow = true
    }, 500)
  }
})

watch(disconnectedWallet, newStatus => {
  if (newStatus === true) {
    store.commit('web3/setLoggedIn', false)
    router.push('/')
  }
})

watch(changedAccount, (newAccount, oldAccount) => {
  if (newAccount !== oldAccount) {
    store.commit('web3/setLoggedIn', false)
    router.push('/')
  }
})

const handleHoverGateBtn = flag => {
  state.mouseHovered = flag
}

const handleClickGateBtn = () => {
  if (state.gateOpen) {
    state.enteredGate = true
    state.showFog = false
    state.showMenus = false
    setTimeout(() => (state.gateBtnShow = false), 500)
    setTimeout(() => {
      state.gateShow = false
      state.inventoryMenuReady = true
    }, 2000)
  }
}

const handleHoverMapRegion = region => {
  state.mapRegionActive = region
}

const handleClickLabel = status => {
  showMenu()
  handleSquiresMenuActiveStatus(status)
}

const handleSquiresMenuActiveStatus = status => {
  state.squiresMenuActiveStatus = status
}

const handleClickAbout = status => {
  showMenu()
  state.aboutMenuActiveStatus = status
}

const handleClickInventoryItem = status => {
  showMenu()
  state.inventoryItemMenuActiveStatus = status
}

const showMenu = () => {
  state.showFog = true
  state.showMenus = true
}

const handleClickCloseMenu = () => {
  state.showFog = false
  state.showMenus = false
  state.squiresMenuActiveStatus = ''
  state.aboutMenuActiveStatus = ''
  state.inventoryItemMenuActiveStatus = ''
}

onMounted(async () => {
  if (store.state.web3.active === false) router.push('/')
  if (isWrongNetwork.value) state.gateOpen = false
  store.commit('setHomePageLoading', true)
  try {
    if (store.state.socket.socketInstance && store.state.web3.active === true) {
      await store.dispatch('items/getApprovedFief')
      await store.dispatch('items/getApprovedItems')
      await store.dispatch('squires/getApproved')
      await store.dispatch('socket/getSquires')
      await store.dispatch('socket/getInventoryItems')
    }
  } catch (error) {
    store.commit('setHomePageLoading', false)
    console.log(error)
  }
})
</script>

<template>
  <template v-if="homePageLoading">
    <loader />
  </template>
  <template v-if="!homePageLoading">
    <gate
      :is-hover-class="isHoverClass"
      :is-wrong-network="isWrongNetwork"
      :gate-open="state.gateOpen"
      :gate-show="state.gateShow"
      :gate-btn-show="state.gateBtnShow"
      :entered-gate="state.enteredGate"
      @handle-hover-gate-btn="handleHoverGateBtn"
      @handle-click-gate-btn="handleClickGateBtn"
    />
    <menus :show-menus="state.showMenus">
      <inventory-menu :inventory-menu-ready="state.inventoryMenuReady" @handle-click-inventory-item="handleClickInventoryItem" />
      <inventory-item-menus
        :inventory-item-menu-active-status="state.inventoryItemMenuActiveStatus"
        @handle-click-close-menu="handleClickCloseMenu"
        @handle-click-inventory-item="handleClickInventoryItem"
      />
      <approve-menus
        :squires-menu-active-status="state.squiresMenuActiveStatus"
        :inventory-item-menu-active-status="state.inventoryItemMenuActiveStatus"
        @handle-squires-menu-active-status="handleSquiresMenuActiveStatus"
        @handle-click-inventory-item="handleClickInventoryItem"
      />
      <deposit-squires-menu
        :squires-menu-active-status="state.squiresMenuActiveStatus"
        @handle-click-close-menu="handleClickCloseMenu"
        @handle-squires-menu-active-status="handleSquiresMenuActiveStatus"
      />
      <deposit-fief-menu
        :inventory-item-menu-active-status="state.inventoryItemMenuActiveStatus"
        @handle-click-close-menu="handleClickCloseMenu"
        @handle-click-inventory-item="handleClickInventoryItem"
      />
      <deposit-items-menu
        :inventory-item-menu-active-status="state.inventoryItemMenuActiveStatus"
        @handle-click-close-menu="handleClickCloseMenu"
        @handle-click-inventory-item="handleClickInventoryItem"
      />
      <squires-menus
        :squires-menu-active-status="state.squiresMenuActiveStatus"
        @handle-click-close-menu="handleClickCloseMenu"
        @handle-squires-menu-active-status="handleSquiresMenuActiveStatus"
      />
      <loot-menu
        :squires-menu-active-status="state.squiresMenuActiveStatus"
        @handle-click-close-menu="handleClickCloseMenu"
        @handle-squires-menu-active-status="handleSquiresMenuActiveStatus"
      />
      <about-menus :about-menu-active-status="state.aboutMenuActiveStatus" @handle-click-close-menu="handleClickCloseMenu" />
    </menus>
    <world
      :show-fog="state.showFog"
      :map-region-active="state.mapRegionActive"
      @handle-hover-map-region="handleHoverMapRegion"
      @handle-click-label="handleClickLabel"
      @handle-click-about="handleClickAbout"
    />
  </template>
</template>

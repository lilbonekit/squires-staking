<script setup>
import { reactive, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { squiresType } from '@/config/constants/squiresType'
import { itemRarity } from '@/config/constants/itemRarity'

const store = useStore()

const props = defineProps({
  squiresMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu', 'handle-squires-menu-active-status'])

const state = reactive({
  currentMenuActiveStatus: '',
  questType: '',
  upgradedSquires: [],
  newItems: [],
  fiefSum: 0,
})
const menuActiveStatus = computed(() => props.squiresMenuActiveStatus)

watch(menuActiveStatus, (newStatus, oldStatus) => {
  if (newStatus === 'loot') {
    state.currentMenuActiveStatus = oldStatus
    state.questType = oldStatus.split('/')[0].charAt(0).toUpperCase() + oldStatus.split('/')[0].slice(1)
    let upgradedSquires = []
    let newItems = []
    let fiefSum = 0
    console.log(store.state.squires.loot)
    store.state.squires.loot.forEach(lootData => {
      if (lootData.upgrades[0] !== 'None') upgradedSquires.push(store.state.items.squires.filter(squire => squire.tokenId === lootData.id)[0])
      if (lootData.items.length > 0) newItems.push(store.state.items.inventoryItems.filter(item => item.id === lootData.items[0].id)[0])
      fiefSum += Number(lootData.fief)
    })
    state.upgradedSquires = upgradedSquires
    state.newItems = newItems
    state.fiefSum = fiefSum
    console.log('newItems:', newItems)
    console.log('upgradedSquires:', upgradedSquires)
    console.log('fiefSum:', fiefSum)
  }
})

const getUpgradedProperty = squire => {
  let upgradedProperty = store.state.squires.loot.filter(lootData => Number(squire.tokenId) === Number(lootData.id))[0].upgrades[0]
  upgradedProperty = upgradedProperty.charAt(0).toUpperCase() + upgradedProperty.slice(1)
  return upgradedProperty
}

const handleClickCloseMenu = () => {
  emit('handle-squires-menu-active-status', state.currentMenuActiveStatus)
}
</script>

<template>
  <!-- loot -->
  <div class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'loot' }">
    <header class="menu-header">
      <button class="close-menu" @click="handleClickCloseMenu"></button>
      <div class="menu-label">{{ state.questType }} Loot Received</div>
      <p class="menu-description">Your loot from questing in the {{ state.questType }}</p>
      <p v-if="store.state.squires.isRestart" class="menu-description">Your Squires have also been sent back to the {{ state.questType }}!</p>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <p class="menu-description">
            <span>{{ store.state.squires.loot.length }}</span> squire(s) returned from the {{ state.questType }}.
          </p>
          <br />
          <div class="menu-label">
            $FIEF (<span>Counting: {{ state.fiefSum }}</span
            >)
          </div>
          <p class="menu-description">
            <span></span>
            <br />
          </p>

          <div class="menu-label">
            Rewards (<span>{{ state.newItems.length }}/{{ store.state.squires.loot.length }}</span
            >)
          </div>
          <p class="menu-description">
            <span v-for="item in state.newItems">
              <div class="item token">
                <div class="token-image">
                  <div class="menu-label">{{ itemRarity[item.level] }}</div>
                  <img
                    :src="`/assets/images/${String(item.image).slice(
                      String(item.image).slice(0, String(item.image).lastIndexOf('/')).lastIndexOf('/') + 1,
                    )}`"
                    alt="no img"
                  />
                </div>
                <div class="token-stats">
                  <ul>
                    <li class="stat">
                      Type: <span class="stat-value">{{ String(item.type).charAt(0).toUpperCase() + String(item.type).slice(1) }}</span>
                    </li>
                    <li class="stat" v-if="String(item.type) === 'ring'">
                      Class: <span class="stat-value">{{ item.classType }}</span>
                    </li>
                  </ul>
                  <button class="btn quest">
                    <span>{{ item.name }}</span>
                  </button>
                </div>
              </div>
            </span>
            <br />
          </p>
          <div class="menu-label">
            Stat Upgrades (<span>{{ state.upgradedSquires.length }}/{{ store.state.squires.loot.length }}</span
            >)
          </div>
          <p class="menu-description">
            <span v-for="squire in state.upgradedSquires">
              <div class="item token">
                <div class="token-image">
                  <div class="menu-label">{{ squiresType[squire.type].typeName }}</div>
                  <img :src="squiresType[squire.type].image" />
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
                  <button class="btn quest">
                    <span class="token-number">{{ `Squire #${squire.tokenId}: +1 ${getUpgradedProperty(squire)}` }}</span>
                  </button>
                </div>
              </div>
            </span>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

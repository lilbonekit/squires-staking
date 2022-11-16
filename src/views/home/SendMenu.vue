<script setup>
import { useStore } from 'vuex'
import { squiresType } from '@/config/constants/squiresType'

const store = useStore()

defineProps({
  questType: String,
  squiresMenuActiveStatus: String,
  loading: Boolean,
  loadingMenuDescription: String,
  sendMenuDescription: String,
  squiresDeposited: Array,
  selectedSquiresId: Array,
  isSelected: Function,
  showSendBtn: Boolean,
})
const emit = defineEmits([
  'handle-click-close-menu',
  'handle-squires-menu-active-status',
  'handle-click-refresh',
  'handle-select-squire',
  'handle-click-send-few',
  'handle-click-send-all',
])

const handleClickDeposit = () => {
  if (store.state.squires.approved) emit('handle-squires-menu-active-status', 'deposit/squires')
  else emit('handle-squires-menu-active-status', 'approve/squires')
}
</script>

<template>
  <div class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === `${questType}/send` }">
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">{{ questType.charAt(0).toUpperCase() + questType.slice(1) }}</div>
      <p class="menu-description">
        <template v-if="loading">
          {{ loadingMenuDescription }}<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!loading">
          {{ sendMenuDescription }}
        </template>
      </p>
      <button
        class="btn"
        :class="{ quest: loading }"
        :disabled="loading"
        @click="() => emit('handle-squires-menu-active-status', `${questType}/return`)"
      >
        Check Squires Ready to Return
      </button>
      <button class="btn" :class="{ quest: loading }" :disabled="loading" @click="() => emit('handle-click-refresh')">Refresh</button>
      <button
        style="position: absolute; top: 40px; left: 10px"
        class="btn"
        :class="{ quest: loading }"
        :disabled="loading"
        @click="handleClickDeposit"
      >
        Deposit
      </button>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" v-for="squire in squiresDeposited" :key="squire.tokenId" :class="{ selected: isSelected(squire.tokenId) }">
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
              <button class="btn quest" @click="() => emit('handle-select-squire', squire.tokenId)">
                {{ isSelected(squire.tokenId) ? 'Deselect' : 'Select' }} <span class="token-number">#{{ squire.tokenId }}</span>
              </button>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button
            class="btn"
            :class="{ quest: loading }"
            :disabled="loading"
            v-if="showSendBtn"
            @click="() => emit('handle-click-send-few', questType)"
          >
            <span class="num-selected"
              ><span>Send Squire(s) # {{ selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button
            class="btn"
            :class="{ quest: loading || squiresDeposited.length === 0 }"
            :disabled="loading || squiresDeposited.length === 0"
            @click="() => emit('handle-click-send-all', questType)"
          >
            Send All
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

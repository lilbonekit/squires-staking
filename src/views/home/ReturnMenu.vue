<script setup>
import { squiresType } from '@/config/constants/squiresType'

defineProps({
  questType: String,
  squiresMenuActiveStatus: String,
  loading: Boolean,
  loadingMenuDescription: String,
  returnMenuDescription: String,
  timeNow: Number,
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
  'handle-click-return-few',
  'handle-click-return-all',
  'handle-click-return-all-and-restart',
])
</script>

<template>
  <div class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === `${questType}/return` }">
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
          {{ returnMenuDescription }}
        </template>
      </p>
      <button id="Forest-quest" class="btn" @click="() => emit('handle-squires-menu-active-status', `${questType}/send`)">
        Check Squires Ready to Quest
      </button>
      <p id="Forest-message" class="menu-description" style="color: grey; text-size: 20px">
        *If you can't see your squires, hit <i>refresh</i> below
      </p>
      <button class="btn" @click="() => emit('handle-click-refresh', questType)">Refresh</button>
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
              <button class="btn quest" v-if="squire.finish - timeNow > 0">
                <span class="token-number"
                  >#{{ squire.tokenId }} is still questing:
                  <span> {{ new Date((squire.finish - timeNow) * 1000).toISOString().substring(11, 8) }} </span></span
                >
              </button>
              <button class="btn quest" @click="() => emit('handle-select-squire', squire.tokenId)" v-else>
                <span class="token-number">#{{ squire.tokenId }} is ready to return</span>
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
            @click="() => emit('handle-click-return-few', questType)"
          >
            <span class="num-selected"
              ><span>Return Squire(s) # {{ selectedSquiresId.toString() }}</span></span
            >
          </button>
          <button class="btn" :class="{ quest: loading }" :disabled="loading" @click="() => emit('handle-click-return-all', questType)">
            Return All
          </button>
        </footer>
        <footer class="menu-controls">
          <button class="btn" :class="{ quest: loading }" :disabled="loading" @click="() => emit('handle-click-return-all-and-restart', questType)">
            Return All and Restart Quest
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

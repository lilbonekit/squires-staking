<script setup>
import { watch, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  squiresMenuActiveStatus: String,
})

const emit = defineEmits(['handle-click-close-menu', 'handle-squires-menu-active-status'])

const menuActiveStatus = computed(() => props.squiresMenuActiveStatus)

watch(menuActiveStatus, newStatus => {
  if (newStatus === 'forest/send' || newStatus === 'mountain/send' || newStatus === 'cavern/send' || newStatus === 'temple/send')
    setTimeout(() => {
      store.dispatch('squires/squiresNoQuesting')
    }, 750)
  if (newStatus === 'forest/return')
    setTimeout(() => {
      store.dispatch('squires/squiresQuestingForest')
    }, 750)
  if (newStatus === 'mountain/return')
    setTimeout(() => {
      store.dispatch('squires/squiresQuestingMountain')
    }, 750)
  if (newStatus === 'cavern/return')
    setTimeout(() => {
      store.dispatch('squires/squiresQuestingCavern')
    }, 750)
  if (newStatus === 'temple/return')
    setTimeout(() => {
      store.dispatch('squires/squiresQuestingCavern')
    }, 750)
})

const getTimestamp = async () => {
  const blockn = await store.state.web3.library.eth.getBlockNumber()
  const block = await store.state.web3.library.eth.getBlock(blockn)
  return block.timestamp
}
</script>

<template>
  <!-- forest -->
  <div id="Forest-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'forest/send' }">
    <header class="menu-header">
      <button id="Close-Forest-Send" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Forest</div>
      <!--<p class="menu-description" id="Forest-Description-Send">Forest Questing will Begin Shortly</p>-->
      <p class="menu-description" id="Forest-Description-Send">
        <template v-if="store.state.squires.loading">
          Loading Squires<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{
            store.state.squires.data.length === 0 ? 'All squires are currently questing!' : 'Select the squires you would like to send off questing'
          }}
        </template>
      </p>
      <button id="Forest-return" class="btn" @click="() => emit('handle-squires-menu-active-status', 'forest/return')">
        Check Squires Ready to Return
      </button>
      <button id="refresh-return-forest" class="btn" @click="() => store.dispatch('squires/squiresNoQuesting')">Refresh</button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => emit('handle-squires-menu-active-status', 'deposit')">
        Deposit
      </button>
    </header>
    <main id="Forest-Console-Send" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresWaitingForest" v-for="squire in store.state.squires.data">
            <div class="item token" id="squireSelected">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" alt="no img" />
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
                <button class="btn quest" id="squires" onclick="pushQuestingF(this)">
                  Select <span class="token-number">#{{ squire.id }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button class="btn" id="Forest-Send-Some" style="display: none" onclick="sign.questForestFew()">
            <span class="num-selected"><span id="questorsF"></span></span>
          </button>
          <button class="btn" id="Forest-Send-All" onclick="sign.questForestAll()">Send All</button>
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
          Loading Questing Squires in Forest<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{
            store.state.squires.data.length === 0 ? 'No squires are currently questing!' : 'Select the squires you would like to return from questing'
          }}
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
      <button id="refresh-quest-forest" class="btn" @click="() => store.dispatch('squires/squiresQuestingForest')">Refresh</button>
    </header>
    <main id="Forest-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresQuestingForest" v-for="squire in store.state.squires.data">
            <div class="item token" id="squireSelectedQuesting">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" alt="no img" />
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
                <button class="btn quest" onclick="pushQuestingFQx()" v-if="squire.finish - getTimestamp() > 0">
                  <span class="token-number"
                    >#{{ squire.id }} is still questing:
                    <span id="timerQF"> {{ new Date((squire.finish - getTimestamp()) * 1000).toISOString().substring(11, 8) }} </span></span
                  >
                </button>
                <button class="btn quest" id="squiresQuesting" onclick="pushQuestingFQ(this)" v-else>
                  <span class="token-number">#{{ squire.id }} is ready to return</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button class="btn" id="Forest-Return-Some" style="display: none" onclick="sign.leaveForestSome()">
            <span class="num-selected"><span id="questorsFQ"></span></span>
          </button>
          <button class="btn" id="Forest-Return-All" onclick="sign.leaveForestAll()">Return All</button>
        </footer>
        <footer class="menu-controls">
          <button class="btn" id="Forest-Return-All-Restart" onclick="sign.leaveForestAllRestart()">Return All and Restart Quest</button>
        </footer>
      </div>
    </main>
  </div>
  <!-- mountain -->
  <div id="Mountain-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'mountain/send' }">
    <header class="menu-header">
      <button id="Close-Mountain-Send" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Mountain</div>
      <!--<p class="menu-description" id="Mountain-Description-Send">Mountain Questing will Begin Shortly</p>-->
      <p class="menu-description" id="Mountain-Description-Send">
        <template v-if="store.state.squires.loading">
          Loading Squires<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{
            store.state.squires.data.length === 0 ? 'All squires are currently questing!' : 'Select the squires you would like to send off questing'
          }}
        </template>
      </p>
      <button id="Mountain-return" class="btn" @click="() => emit('handle-squires-menu-active-status', 'mountain/return')">
        Check Squires Ready to Return
      </button>
      <button id="refresh-return-mountain" class="btn" @click="() => store.dispatch('squires/squiresNoQuesting')">Refresh</button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => emit('handle-squires-menu-active-status', 'deposit')">
        Deposit
      </button>
    </header>
    <main id="Mountain-Console-Send" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresWaitingMountain" v-for="squire in store.state.squires.data">
            <div class="item token" id="squireSelected">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" alt="no img" />
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
                <button class="btn quest" id="squires" onclick="pushQuestingM(this)">
                  Select <span class="token-number">#{{ squire.id }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button class="btn" id="Mountain-Send-Some" style="display: none" onclick="sign.questMountainFew()">
            <span class="num-selected"><span id="questorsM"></span></span>
          </button>
          <button class="btn" id="Mountain-Send-All" onclick="sign.questMountainAll()">Send All</button>
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
          Loading Questing Squires in Mountain<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{
            store.state.squires.data.length === 0 ? 'No squires are currently questing!' : 'Select the squires you would like to return from questing'
          }}
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
      <button id="refresh-quest-mountain" class="btn" @click="() => store.dispatch('squires/squiresQuestingMountain')">Refresh</button>
    </header>
    <main id="Mountain-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresQuestingMountain" v-for="squire in store.state.squires.data">
            <div class="item token" id="squireSelectedQuesting">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" alt="no img" />
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
                <button class="btn quest" onclick="pushQuestingMQx()" v-if="squire.finish - getTimestamp() > 0">
                  <span class="token-number"
                    >#{{ squire.id }} is still questing:
                    <span id="timerQF"> {{ new Date((squire.finish - getTimestamp()) * 1000).toISOString().substring(11, 8) }} </span></span
                  >
                </button>
                <button class="btn quest" id="squiresQuesting" onclick="pushQuestingMQ(this)" v-else>
                  <span class="token-number">#{{ squire.id }} is ready to return</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button class="btn" id="Mountain-Return-Some" style="display: none" onclick="sign.leaveMountainSome()">
            <span class="num-selected"><span id="questorsMQ"></span></span>
          </button>
          <button class="btn" id="Mountain-Return-All" onclick="sign.leaveMountainAll()">Return All</button>
        </footer>
        <footer class="menu-controls">
          <button class="btn" id="Mountain-Return-All-Restart" onclick="sign.leaveMountainAllRestart()">Return All and Restart Quest</button>
        </footer>
      </div>
    </main>
  </div>

  <!-- cavern -->
  <div id="Cavern-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'cavern/send' }">
    <header class="menu-header">
      <button id="Close-Cavern-Send" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Cavern</div>
      <!--<p class="menu-description" id="Cavern-Description-Send">Cavern Questing will Begin Shortly</p>-->
      <p class="menu-description" id="Cavern-Description-Send">
        <template v-if="store.state.squires.loading">
          Loading Squires<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{
            store.state.squires.data.length === 0 ? 'All squires are currently questing!' : 'Select the squires you would like to send off questing'
          }}
        </template>
      </p>
      <button id="Cavern-return" class="btn" @click="() => emit('handle-squires-menu-active-status', 'cavern/return')">
        Check Squires Ready to Return
      </button>
      <button id="refresh-return-cavern" class="btn" @click="() => store.dispatch('squires/squiresNoQuesting')">Refresh</button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => emit('handle-squires-menu-active-status', 'deposit')">
        Deposit
      </button>
    </header>
    <main id="Cavern-Console-Send" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresWaitingCavern" v-for="squire in store.state.squires.data">
            <div class="item token" id="squireSelected">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" alt="no img" />
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
                <button class="btn quest" id="squires" onclick="pushQuestingC(this)">
                  Select <span class="token-number">#{{ squire.id }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button class="btn" id="Cavern-Send-Some" style="display: none" onclick="sign.questCavernFew()">
            <span class="num-selected"><span id="questorsC"></span></span>
          </button>
          <button class="btn" id="Cavern-Send-All" onclick="sign.questCavernAll()">Send All</button>
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
          Loading Questing Squires in Cavern<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{
            store.state.squires.data.length === 0 ? 'No squires are currently questing!' : 'Select the squires you would like to return from questing'
          }}
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
      <button id="refresh-quest-cavern" class="btn" @click="() => store.dispatch('squires/squiresQuestingCavern')">Refresh</button>
    </header>
    <main id="Cavern-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresQuestingCavern" v-for="squire in store.state.squires.data">
            <div class="item token" id="squireSelectedQuesting">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" alt="no img" />
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
                <button class="btn quest" onclick="pushQuestingCQx()" v-if="squire.finish - getTimestamp() > 0">
                  <span class="token-number"
                    >#{{ squire.id }} is still questing:
                    <span id="timerQF"> {{ new Date((squire.finish - getTimestamp()) * 1000).toISOString().substring(11, 8) }} </span></span
                  >
                </button>
                <button class="btn quest" id="squiresQuesting" onclick="pushQuestingCQ(this)" v-else>
                  <span class="token-number">#{{ squire.id }} is ready to return</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button class="btn" id="Cavern-Return-Some" style="display: none" onclick="sign.leaveCavernSome()">
            <span class="num-selected"><span id="questorsCQ"></span></span>
          </button>
          <button class="btn" id="Cavern-Return-All" onclick="sign.leaveCavernAll()">Return All</button>
        </footer>
        <footer class="menu-controls">
          <button class="btn" id="Cavern-Return-All-Restart" onclick="sign.leaveCavernAllRestart()">Return All and Restart Quest</button>
        </footer>
      </div>
    </main>
  </div>

  <!-- temple -->
  <div id="Temple-Menu__Send" class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'temple/send' }">
    <header class="menu-header">
      <button id="Close-Temple-Send" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Temple</div>
      <p class="menu-description" id="Temple-Closed" v-if="!store.state.user.approveWorship">
        Temple is closed until the next day of worship.<br /><br />You can return your Squires Only
      </p>
      <!--<p class="menu-description" id="Temple-Description-Send">Temple Questing will Begin Shortly</p>-->
      <p class="menu-description" id="Temple-Description-Send" v-if="store.state.user.approveWorship">
        <template v-if="store.state.squires.loading">
          Loading Squires<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{
            store.state.squires.data.length === 0 ? 'All squires are currently questing!' : 'Select the squires you would like to send off questing'
          }}
        </template>
      </p>
      <button id="Temple-return" class="btn" @click="() => emit('handle-squires-menu-active-status', 'temple/return')">
        Check Squires Ready to Return
      </button>
      <button
        id="refresh-return-temple"
        class="btn"
        @click="() => store.dispatch('squires/squiresNoQuesting')"
        v-if="store.state.user.approveWorship"
      >
        Refresh
      </button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => emit('handle-squires-menu-active-status', 'deposit')">
        Deposit
      </button>
    </header>
    <main id="Temple-Console-Send" class="menu-main" v-if="store.state.user.approveWorship">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresWaitingTemple" v-for="squire in store.state.squires.data">
            <div class="item token" id="squireSelected">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" alt="no img" />
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
                <button class="btn quest" id="squires" onclick="pushQuestingT(this)">
                  Select <span class="token-number">#{{ squire.id }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button class="btn" id="Temple-Send-Some" style="display: none" onclick="sign.questTempleFew()">
            <span class="num-selected"><span id="questorsT"></span></span>
          </button>
          <button class="btn" id="Temple-Send-All" onclick="sign.questTempleAll()">Send All</button>
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
          Loading Questing Squires in Temple<br /><img
            class="menu-description"
            style="width: 25%; display: block; margin-left: auto; margin-right: auto"
            src="/assets/images/tnet/images/loading.gif"
          />
        </template>
        <template v-if="!store.state.squires.loading">
          {{
            store.state.squires.data.length === 0 ? 'No squires are currently questing!' : 'Select the squires you would like to return from questing'
          }}
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
      <button id="refresh-quest-temple" class="btn" @click="() => store.dispatch('squires/squiresQuestingTemple')">Refresh</button>
    </header>
    <main id="Temple-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresQuestingTemple" v-for="squire in store.state.squires.data">
            <div class="item token" id="squireSelectedQuesting">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" alt="no img" />
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
                <button class="btn quest" onclick="pushQuestingTQx()" v-if="squire.finish - getTimestamp() > 0">
                  <span class="token-number"
                    >#{{ squire.id }} is still questing:
                    <span id="timerQF"> {{ new Date((squire.finish - getTimestamp()) * 1000).toISOString().substring(11, 8) }} </span></span
                  >
                </button>
                <button class="btn quest" id="squiresQuesting" onclick="pushQuestingTQ(this)" v-else>
                  <span class="token-number">#{{ squire.id }} is ready to return</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="menu-controls">
          <button class="btn" id="Temple-Return-Some" style="display: none" onclick="sign.leaveTempleSome()">
            <span class="num-selected"><span id="questorsTQ"></span></span>
          </button>
          <button class="btn" id="Temple-Return-All" onclick="sign.leaveTempleAll()">Return All</button>
        </footer>
        <footer class="menu-controls" id="restart-temple-closed" v-if="store.state.user.approveWorship">
          <button class="btn" id="Temple-Return-All-Restart" onclick="sign.leaveTempleAllRestart()">Return All and Restart Quest</button>
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

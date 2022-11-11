<script setup>
import { computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { squiresType } from '@/config/constants/squiresType'
import { ringItems, potionItems, trinketItems, itemRarity } from '@/config/constants/inventoryItems'

const store = useStore()

const props = defineProps({
  inventoryItemMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu', 'handle-click-inventory-item'])

const state = reactive({
  fiefAmountText: 'Input Amount of $FIEF to Send:',
  fiefAmountTextColor: 'white',
  fiefAmountTextReadOnly: false,
  fiefAddressText: 'Input Address to Send to:',
  fiefAddressTextColor: 'white',
  fiefAddressTextReadOnly: false,
  fiefSendAmount: 0,
  fiefSendAddress: '',
  showFiefButton: true,
})

const menuActiveStatus = computed(() => props.inventoryItemMenuActiveStatus)

watch(menuActiveStatus, newStatus => {
  if (newStatus === 'fief') {
    state.fiefSendAddress = ''
    state.fiefSendAmount = 0
  }
})

const btnQuestName = squire => {
  return squire.quest !== 'None' ? `questing ${String(squire.quest).charAt(0).toUpperCase() + String(squire.quest).slice(1)}` : `is in town`
}

const updateFiefAmountText = text => {
  state.fiefAmountText = text
  state.fiefAmountTextColor = 'red'
  setTimeout(() => {
    state.fiefAmountTextColor = 'white'
    state.fiefAmountText = 'Input Amount of $FIEF to Send:'
  }, 2000)
}

const updateFiefAddressText = text => {
  state.fiefAddressText = text
  state.fiefAddressTextColor = 'red'
  setTimeout(() => {
    state.fiefAddressTextColor = 'white'
    state.fiefAddressText = 'Input Address to Send to:'
  }, 2000)
}

const handleClickSendFief = async () => {
  if (state.fiefSendAmount <= 0) {
    updateFiefAmountText('Enter more than 0 $FIEF')
  } else if (state.fiefSendAmount > store.state.items.fiefTotal) {
    updateFiefAmountText('You entered more $FIEF than is in your inventory.')
  } else if (state.fiefSendAddress.length !== 42) {
    updateFiefAddressText('Invalid Address, Please Enter a valid 42 character address.')
  } else {
    state.fiefAddressTextReadOnly = true
    state.fiefAmountTextReadOnly = true
    state.showFiefButton = false
  }
}

const handleClickDepositFief = () => {
  if (store.state.items.approvedFief) emit('handle-click-inventory-item', 'deposit/fief')
  else emit('handle-click-inventory-item', 'approve/fief')
}

const handleClickDepositItems = itemType => {
  if (store.state.items.approvedItems) emit('handle-click-inventory-item', `deposit/items/${itemType}`)
  else emit('handle-click-inventory-item', 'approve/items')
}
</script>

<template>
  <div id="Inventory-Squires" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'squires' }">
    <header class="menu-header">
      <button id="Close-Inventory-Squires" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">
        Squires: <span id="squires-total-inventory">{{ store.state.items.squireTotal }}</span>
      </div>
      <button id="refresh-squire-inventory" class="btn" @click="() => store.dispatch('socket/getSquires')">Refresh</button>
      <p class="menu-description">
        Squires Questing: <span id="squires-total-questing">{{ store.state.items.squireTotalQuesting }}</span>
      </p>
      <p class="menu-description">
        Squires in Town: <span id="squires-total-town">{{ store.state.items.squireTotalTown }}</span>
      </p>
    </header>
    <main id="Squire-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" v-for="squire in store.state.items.squires.sort((a, b) => a.tokenId - b.tokenId)" :key="squire.tokenId">
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
                <span class="token-number">{{ `#${squire.tokenId} ${btnQuestName(squire)}` }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div id="Inventory-Fief" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'fief' }">
    <header class="menu-header">
      <button id="Close-Inventory-Fief" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">
        $FIEF: <span id="fief-total-inventory">{{ store.state.items.fiefTotal }}</span>
      </div>
      <p id="fief-input-amount-text" class="menu-description" :style="{ color: state.fiefAmountTextColor, transition: 'all 2s ease-out' }">
        {{ state.fiefAmountText }}
      </p>
      <input
        v-model="state.fiefSendAmount"
        id="fief-input-amount"
        type="number"
        style="width: 25%; text-align: center"
        :readonly="state.fiefAmountTextReadOnly"
      />
      <p id="fief-input-address-text" class="menu-description" :style="{ color: state.fiefAddressTextColor, transition: 'all 2s ease-out' }">
        {{ state.fiefAddressText }}
      </p>
      <input
        v-model="state.fiefSendAddress"
        id="fief-input-address"
        type="text"
        style="width: 75%; text-align: center"
        :readonly="state.fiefAddressTextReadOnly"
      />
      <button v-if="state.showFiefButton" id="send-fief-button" class="btn" @click="handleClickSendFief">Send FIEF</button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="handleClickDepositFief">Deposit</button>
    </header>
  </div>

  <div id="Inventory-Potion" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'potion' }">
    <header class="menu-header">
      <div class="menu-label">
        Potions: <span id="potionTotal-inventory">{{ store.state.items.potionTotal }}</span>
      </div>
      <button id="Close-Inventory-Potion" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => handleClickDepositItems('potion')">Deposit</button>
    </header>
    <main id="Potion-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" v-for="potion in potionItems" :key="potion.id">
            <div class="token-image">
              <div class="menu-label">{{ itemRarity[potion.level] }}</div>
              <img :src="`/assets/images/potions/${potion.name}.png`" alt="no img" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value">{{ store.state.items.potions[potion.id] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">{{ potion.name }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'ring' }">
    <header class="menu-header">
      <div class="menu-label">
        Rings: <span>{{ store.state.items.ringTotal }}</span>
      </div>
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => handleClickDepositItems('ring')">Deposit</button>
    </header>
    <main class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" v-for="ring in ringItems" :key="ring.id">
            <div class="token-image">
              <div class="menu-label">{{ itemRarity[ring.level] }}</div>
              <img :src="`/assets/images/rings/${ring.name}.png`" alt="no img" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value">{{ store.state.items.rings[ring.id] }}</span>
                </li>
              </ul>
              <button class="btn quest">{{ ring.name }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div id="Inventory-Trinket" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'trinket' }">
    <header class="menu-header">
      <div class="menu-label">
        Trinkets: <span id="trinketTotal-inventory">{{ store.state.items.trinketTotal }}</span>
      </div>
      <button id="Close-Inventory-Trinket" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <button style="position: absolute; top: 40px; left: 10px" class="btn" @click="() => handleClickDepositItems('trinket')">Deposit</button>
    </header>
    <main id="Trinket-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" v-for="trinket in trinketItems" :key="trinket.id">
            <div class="token-image">
              <div class="menu-label">{{ itemRarity[trinket.level] }}</div>
              <img :src="`/assets/images/trinkets/${trinket.name}.png`" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value">{{ store.state.items.trinkets[trinket.id] }}</span>
                </li>
              </ul>
              <button class="btn quest">{{ trinket.name }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div id="Inventory-Gear" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'gear' }">
    <header class="menu-header">
      <button id="Close-Inventory-Gear" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Gear Inventory</div>
      <p class="menu-description">Gear inventory coming with release of Gears!</p>
      <!--<button class ="btn" onclick="sign.approveForest()">Approve Forest</button>-->
      <!--<button class ="btn" onclick="sign.approveMountain()">Approve Mountain</button>-->
      <!--<button  class ="btn" onclick="sign.approveCavern()">Approve Cavern</button>-->
      <!--<button  class ="btn" onclick="sign.approveTemple()">Approve Temple</button>-->
    </header>
  </div>
</template>

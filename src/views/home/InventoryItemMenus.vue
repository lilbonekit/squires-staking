<script setup>
import { computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { fief } from '@/config/constants/contracts'
import getContract from '@/utils/getContract'

const store = useStore()

const props = defineProps({
  inventoryItemMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu'])

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

const btnQuestName = computed(squire =>
  squire.questing ? `questing ${String(squire.questtype).charAt(0).toUpperCase() + String(squire.questtype).slice(1)}` : `is in town`,
)
const menuActiveStatus = computed(() => props.inventoryItemMenuActiveStatus)

watch(menuActiveStatus, newStatus => {
  if (newStatus === 'fief') {
    state.fiefSendAddress = ''
    state.fiefSendAmount = 0
  }
})

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
  } else if (state.fiefSendAmount > store.state.user.fiefTotal) {
    updateFiefAmountText('You entered more $FIEF than is in your inventory.')
  } else if (state.fiefSendAddress.length !== 42) {
    updateFiefAddressText('Invalid Address, Please Enter a valid 42 character address.')
  } else {
    state.fiefAddressTextReadOnly = true
    state.fiefAmountTextReadOnly = true
    state.showFiefButton = false
    const fiefContract = getContract(store.state.web3.library, fief.abi, fief.address)
    const setTokens = BigInt(state.fiefSendAmount)
    const setMultiplier = BigInt('1000000000000000000')
    const sendAmount = setTokens * setMultiplier

    try {
      await fiefContract.methods.transfer(state.fiefSendAddress, sendAmount).send({ from: store.state.web3.account })
      await store.dispatch('user/getFiefTotal')
    } catch (error) {
      console.log(error)
    } finally {
      state.fiefAddressTextReadOnly = false
      state.fiefAmountTextReadOnly = false
      state.showFiefButton = true
    }
  }
}
</script>

<template>
  <div id="Inventory-Squires" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'squires' }">
    <header class="menu-header">
      <button id="Close-Inventory-Squires" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">
        Squires: <span id="squires-total-inventory">{{ store.state.user.squireTotal }}</span>
      </div>
      <button id="refresh-squire-inventory" class="btn" @click="() => store.dispatch('socket/getSquires')">Refresh</button>
      <p class="menu-description">
        Squires Questing: <span id="squires-total-questing">{{ store.state.user.squireTotalQuesting }}</span>
      </p>
      <p class="menu-description">
        Squires in Town: <span id="squires-total-town">{{ store.state.user.squireTotalTown }}</span>
      </p>
    </header>
    <main id="Squire-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div id="squiresInventory" v-for="(squire, index) in store.state.user.squires" :key="index">
            <div class="item token" id="squireSelectedQuesting">
              <div class="token-image">
                <div class="menu-label">{{ squire.typename }}</div>
                <img :src="squire.image" />
              </div>
              <div class="token-stats">
                <ul>
                  <li class="stat">
                    <i class="stat-icon"><img src="https://knightsoftheether.com/beta/i/kote-icon-axe.png" /></i>Strength:
                    <span class="stat-value">{{ squire.strength }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="https://knightsoftheether.com/beta/i/kote-icon-jewel.png" /></i>Luck:
                    <span class="stat-value">{{ squire.luck }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="https://knightsoftheether.com/beta/i/kote-icon-sparkle.png" /></i>Wisdom:
                    <span class="stat-value">{{ squire.wisdom }}</span>
                  </li>
                  <li class="stat">
                    <i class="stat-icon"><img src="https://knightsoftheether.com/beta/i/kote-icon-staff.png" /></i>Faith:
                    <span class="stat-value">{{ squire.faith }}</span>
                  </li>
                </ul>
                <button class="btn quest">
                  <span class="token-number">{{ `#${squire.id} ${btnQuestName(squire)}` }}</span>
                </button>
              </div>
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
        $FIEF: <span id="fief-total-inventory">{{ store.state.user.fiefTotal }}</span>
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
    </header>
  </div>

  <div id="Inventory-Potion" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'potion' }">
    <header class="menu-header">
      <div class="menu-label">
        Potions: <span id="potionTotal-inventory">{{ store.state.user.potionTotal }}</span>
      </div>
      <button id="Close-Inventory-Potion" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
    </header>
    <main id="Potion-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/potions/Luck Potion.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p1">{{ store.state.user.potions[0] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Luck Potion</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/potions/Levitation Potion.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p2">{{ store.state.user.potions[1] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Levitation Potion</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/potions/Strong Brew.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p3">{{ store.state.user.potions[2] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Strong Brew</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/potions/Pava Root Potion.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p4">{{ store.state.user.potions[3] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Pava Root Potion</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/potions/Spring Water Flask.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p5">{{ store.state.user.potions[4] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Spring Water Flask</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/potions/Mirroring Potion.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p6">{{ store.state.user.potions[5] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Mirroring Potion</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/potions/Phial of Defense.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p7">{{ store.state.user.potions[6] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Phial of Defense</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/potions/Slime Vial.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p8">{{ store.state.user.potions[7] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Slime Vial</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/potions/Ichor Draft.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p9">{{ store.state.user.potions[8] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Ichor Draft</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/potions/Holy Water.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p10">{{ store.state.user.potions[9] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Holy Water</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/potions/Murky Flask.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p11">{{ store.state.user.potions[10] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Murky Flask</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/potions/Arcane Brew.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p12">{{ store.state.user.potions[11] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Arcane Brew</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/potions/Berserkers Brew.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p13">{{ store.state.user.potions[12] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Berserkers Brew</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/potions/Spirit Vial.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p14">{{ store.state.user.potions[13] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Spirit Vial</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/potions/Flask of Resolve.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p15">{{ store.state.user.potions[14] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Flask of Resolve</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/potions/Lucidity Elixir.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p16">{{ store.state.user.potions[15] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Lucidity Elixir</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/potions/Philter of Redemption.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p17">{{ store.state.user.potions[16] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Philter of Redemption</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/potions/Lavender Extract.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p18">{{ store.state.user.potions[17] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Lavender Extract</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/potions/Trippie Draught.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p19">{{ store.state.user.potions[18] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Trippie Draught</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/potions/Phantom Phial.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p20">{{ store.state.user.potions[19] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Phantom Phial</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/potions/Bloodlust Flask.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p21">{{ store.state.user.potions[20] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Bloodlust Flask</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/potions/Misty Phial.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p22">{{ store.state.user.potions[21] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Misty Phial</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/potions/Spirit Elixir.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p23">{{ store.state.user.potions[22] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Spirit Elixir</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/potions/Dew Drop Vial.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p24">{{ store.state.user.potions[23] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Dew Drop Vial</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/potions/Master Brew.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="p25">{{ store.state.user.potions[24] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Master Brew</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div id="Inventory-Ring" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'ring' }">
    <header class="menu-header">
      <div class="menu-label">
        Rings: <span id="ringTotal-inventory">{{ store.state.user.ringTotal }}</span>
      </div>
      <button id="Close-Inventory-Ring" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
    </header>
    <main id="Ring-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/rings/Gold Ring of Burn Defense.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r1">{{ store.state.user.rings[0] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Gold Ring of Burn Defense</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/rings/Gold Ring of Avoidance.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r2">{{ store.state.user.rings[1] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Gold Ring of Avoidance</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/rings/Steel Ring of Fiendsbane.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r3">{{ store.state.user.rings[2] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Steel Ring of Fiendsbane</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/rings/Titanium Ring of Fey Resistance.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r4">{{ store.state.user.rings[3] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Titanium Ring of Fey Resistance</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/rings/Gold Ring of Energy.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r5">{{ store.state.user.rings[4] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Gold Ring of Energy</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/rings/Titanium Ring of the Forest.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r6">{{ store.state.user.rings[5] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Titanium Ring of the Forest</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/rings/Silver Ring of Restoration.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r7">{{ store.state.user.rings[6] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Silver Ring of Restoration</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/rings/Bronze Ring of Alchemy.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r8">{{ store.state.user.rings[7] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Bronze Ring of alchemy</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/rings/Platinum Ring of Confusion.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r9">{{ store.state.user.rings[8] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Platinum Ring of Confusion</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/rings/Rose Gold Ring of Reaction.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r10">{{ store.state.user.rings[9] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Rose Gold Ring of Reaction</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/rings/Diamond Ring of Spikes.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r11">{{ store.state.user.rings[10] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Diamond Ring of Spikes</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/rings/Brass Ring of Advantage.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r12">{{ store.state.user.rings[11] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Brass Ring of Advantage</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/rings/Kyanite Ring of Courage.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r13">{{ store.state.user.rings[12] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Kyanite Ring of Courage</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/rings/Gold Ring of Ingenuity.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r14">{{ store.state.user.rings[13] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Gold Ring of Ingenuity</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/rings/Silver Ring of the Deep Sleep.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r15">{{ store.state.user.rings[14] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Silver Ring of the Deep Sleep</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/rings/Gold Ring of Combustion.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r16">{{ store.state.user.rings[15] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Gold Ring of Combustion</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/rings/Silver Ring of Duplication.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r17">{{ store.state.user.rings[16] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Silver Ring of Duplication</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/rings/Brass Ring of Quick Reflexes.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r18">{{ store.state.user.rings[17] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Brass Ring of Quick Reflexes</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/rings/Marble Ring of Retention.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r19">{{ store.state.user.rings[18] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Marble Ring of Retention</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/rings/Pearl Ring of Spirit.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r20">{{ store.state.user.rings[19] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Pearl Ring of Spirit</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/rings/Stone Ring of Increase.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r21">{{ store.state.user.rings[20] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Stone Ring of Increase</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/rings/Steel Ring of Protection.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r22">{{ store.state.user.rings[21] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Steel Ring of Protection</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/rings/Gold Ring of Determination.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r23">{{ store.state.user.rings[22] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Gold Ring of Determination</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/rings/Amber Ring of Withstanding.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r24">{{ store.state.user.rings[23] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Amber Ring of Withstanding</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/rings/Etheric Ring of Renewal.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="r25">{{ store.state.user.rings[24] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Etheric Ring of Renewal</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div id="Inventory-Trinket" class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'trinket' }">
    <header class="menu-header">
      <div class="menu-label">
        Trinkets: <span id="trinketTotal-inventory">{{ store.state.user.trinketTotal }}</span>
      </div>
      <button id="Close-Inventory-Trinket" class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
    </header>
    <main id="Trinket-Console" class="menu-main">
      <div class="content">
        <div class="menu-list scrolling-list">
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/trinkets/Wee Red Mushroom.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t1">{{ store.state.user.trinkets[0] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Wee Red Mushroom</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/trinkets/Pine Resin.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t2">{{ store.state.user.trinkets[1] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Pine Resin</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/trinkets/Birdcage.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t3">{{ store.state.user.trinkets[2] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Birdcage</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/trinkets/Glowing Rune.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t4">{{ store.state.user.trinkets[3] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Glowing Rune</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/trinkets/Ether Crystal.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t5">{{ store.state.user.trinkets[4] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Ether Crystal</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/trinkets/Rabbit Foot.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t6">{{ store.state.user.trinkets[5] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Rabbit Foot</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Common</div>
              <img src="/assets/images/trinkets/Poisonous Frog.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t7">{{ store.state.user.trinkets[6] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Poisonous Frog</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/trinkets/Acorns.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t8">{{ store.state.user.trinkets[7] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Acorns</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/trinkets/Torch.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t9">{{ store.state.user.trinkets[8] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Torch</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/trinkets/Dream Amulet.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t10">{{ store.state.user.trinkets[9] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Dream Amulet</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/trinkets/Dusty Scroll.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t11">{{ store.state.user.trinkets[10] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Dusty Scroll</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/trinkets/Crustacean Claw.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t12">{{ store.state.user.trinkets[11] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Crustacean Claw</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/trinkets/Goblet.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t13">{{ store.state.user.trinkets[12] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Goblet</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Uncommon</div>
              <img src="/assets/images/trinkets/Draca Fangs.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t14">{{ store.state.user.trinkets[13] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Draca Fangs</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/trinkets/Gargoyle.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t15">{{ store.state.user.trinkets[14] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Gargoyle</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/trinkets/Bat Wing.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t16">{{ store.state.user.trinkets[15] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Bat Wing</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/trinkets/Runic Tome.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t17">{{ store.state.user.trinkets[16] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Runic Tome</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/trinkets/Lucky Die.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t18">{{ store.state.user.trinkets[17] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Lucky Die</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Rare</div>
              <img src="/assets/images/trinkets/Golem Eye.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t19">{{ store.state.user.trinkets[18] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Golem Eye</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/trinkets/Phoenix Egg.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t20">{{ store.state.user.trinkets[19] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Phoenix Egg</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/trinkets/Abyssal Talisman.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t21">{{ store.state.user.trinkets[20] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Abyssal Talisman</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/trinkets/Enchanted Goggles.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t22">{{ store.state.user.trinkets[21] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Enchanted Goggles</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Epic</div>
              <img src="/assets/images/trinkets/Magic Coinpurse.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t23">{{ store.state.user.trinkets[22] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Magic Coinpurse</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/trinkets/Hand Candle.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t24">{{ store.state.user.trinkets[23] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Hand Candle</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/trinkets/Mask of Valathor.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t25">{{ store.state.user.trinkets[24] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Mask of Valathor</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/trinkets/Wild Cucumber.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t26">{{ store.state.user.trinkets[25] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">Wild Cucumber</button>
            </div>
          </div>
          <div class="item token" id="squireSelected">
            <div class="token-image">
              <div class="menu-label">Legendary</div>
              <img src="/assets/images/trinkets/Underdark Egg.png" />
            </div>
            <div class="token-stats">
              <ul>
                <li class="stat">
                  Amount: <span class="stat-value" id="t27">{{ store.state.user.trinkets[26] }}</span>
                </li>
              </ul>
              <button class="btn quest" id="squires">UnderDark Egg</button>
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

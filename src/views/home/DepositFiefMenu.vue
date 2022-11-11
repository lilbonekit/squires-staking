<script setup>
import { computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  inventoryItemMenuActiveStatus: String,
})
const emit = defineEmits(['handle-click-close-menu', 'handle-click-inventory-item'])

const state = reactive({
  fiefAmountText: 'Input Amount of $FIEF you would like to Deposit:',
  fiefAmountTextColor: 'white',
  fiefAmount: 0,
  loadingMenuDescription: 'Gathering $FIEF to Deposit',
})

const menuActiveStatus = computed(() => props.inventoryItemMenuActiveStatus)

watch(menuActiveStatus, newStatus => {
  if (newStatus === 'deposit/fief') {
    setTimeout(() => {
      state.loadingMenuDescription = 'Gathering $FIEF to Deposit'
      state.fiefAmount = 0
      store.dispatch('items/getFiefToDeposit')
    }, 750)
  }
})

const updateFiefAmountText = text => {
  state.fiefAmountText = text
  state.fiefAmountTextColor = 'red'
  setTimeout(() => {
    state.fiefAmountTextColor = 'white'
    state.fiefAmountText = 'Input Amount of $FIEF you would like to Deposit:'
  }, 2000)
}

const handleClickDepositFief = async () => {
  if (state.fiefAmount <= 0) {
    updateFiefAmountText('Enter more than 0 $FIEF')
  } else if (state.fiefAmount > store.state.items.fiefToDeposit) {
    updateFiefAmountText('You entered more $FIEF than you have.')
  } else {
    state.loadingMenuDescription = `Depositing ${state.fiefAmount} $FIEF and Prompting Metamask`
    await store.dispatch('items/depositFief', state.fiefAmount)
    state.fiefAmount = 0
    emit('handle-click-inventory-item', 'fief')
  }
}
</script>

<template>
  <div class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'deposit/fief' }">
    <header class="menu-header">
      <button class="close-menu" @click="() => emit('handle-click-close-menu')"></button>
      <div class="menu-label">Deposit $FIEF</div>
      <template v-if="store.state.items.loading">
        <p class="menu-description">{{ state.loadingMenuDescription }}</p>
        <img
          class="menu-description"
          style="width: 20%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        />
      </template>
      <template v-else>
        <p class="menu-description">Max Amount of $FIEF you can Deposit:</p>
        <p class="menu-description">{{ store.state.items.fiefToDeposit }}</p>
      </template>
      <p class="menu-description" :style="{ color: state.fiefAmountTextColor, transition: 'all 2s ease-out' }">
        {{ state.fiefAmountText }}
      </p>
      <input v-model="state.fiefAmount" type="number" style="width: 25%; text-align: center" :readonly="store.state.items.loading" />
      <br />
      <button
        class="btn"
        :class="{ quest: store.state.items.loading || store.state.items.fiefToDeposit === 0 }"
        :disabled="store.state.items.loading || store.state.items.fiefToDeposit === 0"
        @click="handleClickDepositFief"
      >
        Deposit FIEF
      </button>
    </header>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  squiresMenuActiveStatus: String,
  inventoryItemMenuActiveStatus: String,
})
const emit = defineEmits(['handle-squires-menu-active-status', 'handle-click-inventory-item'])

const approved = computed(() => store.state.squires.approved)
const approvedFief = computed(() => store.state.items.approvedFief)
const approvedItems = computed(() => store.state.items.approvedItems)

watch(approved, newStatus => {
  if (newStatus && props.squiresMenuActiveStatus === 'approve/squires') emit('handle-squires-menu-active-status', 'deposit/squires')
})

watch(approvedFief, newStatus => {
  if (newStatus && props.inventoryItemMenuActiveStatus === 'approve/fief') emit('handle-click-inventory-item', 'deposit/fief')
})

watch(approvedItems, (newStatus, oldStatus) => {
  if (newStatus && props.inventoryItemMenuActiveStatus === 'approve/items') emit('handle-click-inventory-item', `deposit/items/${oldStatus}`)
})
</script>

<template>
  <div class="menu quest-menu" :class="{ 'menu-active': squiresMenuActiveStatus === 'approve/squires' }" style="z-index: 13">
    <header class="menu-header">
      <div class="menu-label">Squires Contract Approving</div>
      <p class="menu-description">Approve the Squires Contract(ERC721) to deposit into the KoteStorage Bridge Contract</p>
      <template v-if="store.state.squires.loading">
        <img
          class="menu-description"
          style="width: 20%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        />
      </template>
      <template v-else>
        <br />
      </template>

      <button
        class="btn"
        :class="{ quest: store.state.squires.loading }"
        :disabled="store.state.squires.loading"
        @click="() => store.dispatch('squires/approveSquiresContract')"
      >
        Approve Squires Contract
      </button>
    </header>
  </div>
  <div class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'approve/fief' }" style="z-index: 13">
    <header class="menu-header">
      <div class="menu-label">Fief Contract Approving</div>
      <p class="menu-description">Approve the Fief Contract(ERC20) to deposit into the KoteStorage Bridge Contract</p>
      <template v-if="store.state.items.loading">
        <img
          class="menu-description"
          style="width: 20%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        />
      </template>
      <template v-else>
        <br />
      </template>

      <button
        class="btn"
        :class="{ quest: store.state.items.loading }"
        :disabled="store.state.items.loading"
        @click="() => store.dispatch('items/approveFiefContract')"
      >
        Approve Fief Contract
      </button>
    </header>
  </div>
  <div class="menu quest-menu" :class="{ 'menu-active': inventoryItemMenuActiveStatus === 'approve/items' }" style="z-index: 13">
    <header class="menu-header">
      <div class="menu-label">Inventory Items Contract Approving</div>
      <p class="menu-description">Approve the Inventory Items Contract(ERC1155) to deposit into the KoteStorage Bridge Contract</p>
      <template v-if="store.state.items.loading">
        <img
          class="menu-description"
          style="width: 20%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        />
      </template>
      <template v-else>
        <br />
      </template>

      <button
        class="btn"
        :class="{ quest: store.state.items.loading }"
        :disabled="store.state.items.loading"
        @click="() => store.dispatch('items/approveItemsContract')"
      >
        Approve Inventory Items Contract
      </button>
    </header>
  </div>
</template>

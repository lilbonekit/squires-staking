<script setup>
import { useStore } from 'vuex'

const store = useStore()
</script>

<template>
  <div class="menu quest-menu" :class="{ 'menu-active': !store.state.squires.approved }" style="z-index: 13">
    <header class="menu-header">
      <div class="menu-label">Squires Approving</div>
      <!-- <p class="menu-description">Hey! We recently released a new questing contract:<br />Temple!</p> -->
      <!-- <br /> -->
      <p class="menu-description">Approve all of the Squires(ERC721) to deposit them into the KoteStorage Bridge Contract</p>
      <template v-if="store.state.squires.loading">
        <img
          class="menu-description"
          style="width: 20%; display: block; margin-left: auto; margin-right: auto"
          src="/assets/images/tnet/images/loading.gif"
        />
      </template>
      <template v-if="!store.state.squires.loading">
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
  <!-- <div id="Forest-Menu__Approve" class="menu quest-menu" :class="{ 'menu-active': !store.state.user.approveForest }" style="z-index: 14">
    <header class="menu-header">
      <div class="menu-label">Forest Questing</div>
      <p class="menu-description">Hey! We recently pushed an update to our contracts</p>
      <p class="menu-description">Approve the Forest Questing Contract To Start Questing</p>
      <br />
      <p class="menu-description">After you've aproved, head over to Forest to return squires from the old contract</p>
      <button class="btn" @click="() => store.dispatch('items/approveForest')">Approve New Forest Contract</button>
    </header>
  </div>
  <div id="Cavern-Menu__Approve" class="menu quest-menu" :class="{ 'menu-active': !store.state.user.approveCavern }" style="z-index: 15">
    <header class="menu-header">
      <div class="menu-label">Cavern Questing</div>
      <p class="menu-description">We also released the cavern contract!</p>
      <p class="menu-description">Approve the Cavern Questing Contract To Start Questing the Cavern</p>
      <br />
      <button class="btn" @click="() => store.dispatch('items/approveCavern')">Approve New Cavern Contract</button>
    </header>
  </div>
  <div id="Mountain-Menu__Approve" class="menu quest-menu" :class="{ 'menu-active': !store.state.user.approveMountain }" style="z-index: 16">
    <header class="menu-header">
      <div class="menu-label">Mountain Questing</div>
      <p class="menu-description">Hey! We recently released new questing contracts</p>
      <p class="menu-description">Approve the Mountain Questing Contract To Start Questing the Mountain</p>
      <br />
      <button class="btn" @click="() => store.dispatch('items/approveMountain')">Approve New Mountain Contract</button>
    </header>
  </div> -->
</template>

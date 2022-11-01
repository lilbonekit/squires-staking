<script setup>
import { onMounted, computed, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Web3Modal from 'web3modal'
import { providerOptions } from '@/config/constants/providerOptions'
import Loader from '@/components/Loader.vue'

const store = useStore()
const router = useRouter()

const state = reactive({
  loading: true,
})

const isLoggedIn = computed(() => (store.state.user.loggedIn ? true : false))
const initWeb3Modal = computed(() => store.state.web3.web3Modal)

watch(initWeb3Modal, newWeb3Modal => {
  if (newWeb3Modal !== null) state.loading = false
})

watch(isLoggedIn, newStatus => {
  if (newStatus === true) {
    state.loading = false
    router.push('/home')
  }
})

const handleConnectWallet = async () => {
  try {
    await store.dispatch('web3/connect')
    await store.dispatch('socket/initializeSocketInstance')
    await store.dispatch('socket/login')
    state.loading = true
  } catch (error) {
    state.loading = false
    console.log(error)
  }
}

onMounted(() => {
  const web3Modal = new Web3Modal({
    providerOptions,
    theme: 'dark',
  })
  store.commit('web3/setWeb3Modal', web3Modal)
})
</script>

<template>
  <loader v-if="state.loading" />
  <div id="Prepare" v-if="!state.loading">
    <div class="centered" id="image">
      <img src="/assets/images/logo_title_only.png" alt="Logo Title" />
    </div>
    <div class="centered_music">
      <p class="menu-description" style="color: rgba(255, 255, 255, 0.8)">*Once connected, this website will play music</p>
    </div>
    <div class="centered_btn">
      <button id="btn-connect" class="Connect__Button" @click="() => handleConnectWallet()">Connect Wallet</button>
    </div>

    <div class="centered_tutorial">
      <a target="_blank" href="https://medium.com/@AdamInEtherland/the-great-faq-of-our-time-7b8634ecdf52">
        <button style="text-decoration: none" class="Connect__Button">Read FAQ</button>
      </a>
    </div>
  </div>
</template>

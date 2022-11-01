import { cavern, fief, forest, mountain, potion, ring, squire, temple, trinket } from '@/config/constants/contracts'
import getContract from '@/utils/getContract'
import * as userService from '@/services/user.service'

const userModule = {
  namespaced: true,
  state: {
    balance: 0,
    loggedIn: false,
    fiefTotal: 0,
    squires: [],
    squireTotal: 0,
    squireTotalQuesting: 0,
    squireTotalTown: 0,
    potions: new Array(25).fill(0),
    potionTotal: 0,
    rings: new Array(25).fill(0),
    ringTotal: 0,
    trinkets: new Array(27).fill(0),
    trinketTotal: 0,
    // approveForest: false,
    // approveCavern: false,
    // approveMountain: false,
    // approveTemple: false,
    // approveWorship: false,
  },
  getters: {},
  mutations: {
    setBalance(state, payload) {
      state.balance = payload
    },
    setLoggedIn(state, status) {
      state.loggedIn = status
    },
    setFiefTotal(state, payload) {
      state.fiefTotal = payload
    },
    setSquireTotal(state, payload) {
      state.squires = payload.squires
      state.squireTotal = payload.squireTotal
      state.squireTotalQuesting = payload.squireTotalQuesting
      state.squireTotalTown = payload.squireTotalTown
    },
    setPotionTotal(state, payload) {
      state.potions = payload.potions
      state.potionTotal = payload.potionTotal
    },
    setRingTotal(state, payload) {
      state.rings = payload.rings
      state.ringTotal = payload.ringTotal
    },
    setTrinketTotal(state, payload) {
      state.trinkets = payload.trinkets
      state.trinketTotal = payload.trinketTotal
    },
    // setApproveForest(state, status) {
    //   state.approveForest = status
    // },
    // setApproveCavern(state, status) {
    //   state.approveCavern = status
    // },
    // setApproveMountain(state, status) {
    //   state.approveMountain = status
    // },
    // setApproveTemple(state, status) {
    //   state.approveTemple = status
    // },
    // setApproveWorship(state, status) {
    //   state.approveWorship = status
    // },
  },
  actions: {
    async getBalance({ rootState, commit }) {
      const balance = await rootState.web3.library.eth.getBalance(rootState.web3.account)
      commit('setBalance', balance)
      console.log('setBalance', balance)
    },
    // async getFiefTotal({ rootState, commit }) {
    //   const fiefContract = getContract(rootState.web3.library, fief.abi, fief.address)
    //   const fiefTotal = await userService.getFiefTotal(fiefContract, rootState.web3.account)
    //   commit('setFiefTotal', fiefTotal)
    //   console.log('setFiefTotal', fiefTotal)
    // },
    // async getSquireTotal({ rootState, commit }) {
    //   const { squires, squireTotal, squireTotalQuesting, squireTotalTown } = await userService.getSquireTotal(rootState.web3.account)
    //   commit('setSquireTotal', { squires, squireTotal, squireTotalQuesting, squireTotalTown })
    //   console.log('setSquireTotal', { squires, squireTotal, squireTotalQuesting, squireTotalTown })
    // },
    // async getPotionTotal({ rootState, commit }) {
    //   const potionContract = getContract(rootState.web3.library, potion.abi, potion.address)
    //   const { potions, potionTotal } = await userService.getPotionTotal(potionContract, rootState.web3.account)
    //   commit('setPotionTotal', { potions, potionTotal })
    //   console.log('setPotionTotal', { potions, potionTotal })
    // },
    // async getRingTotal({ rootState, commit }) {
    //   const ringContract = getContract(rootState.web3.library, ring.abi, ring.address)
    //   const { rings, ringTotal } = await userService.getRingTotal(ringContract, rootState.web3.account)
    //   commit('setRingTotal', { rings, ringTotal })
    //   console.log('setRingTotal', { rings, ringTotal })
    // },
    // async getTrinketTotal({ rootState, commit }) {
    //   const trinketContract = getContract(rootState.web3.library, trinket.abi, trinket.address)
    //   const { trinkets, trinketTotal } = await userService.getTrinketTotal(trinketContract, rootState.web3.account)
    //   commit('setTrinketTotal', { trinkets, trinketTotal })
    //   console.log('setTrinketTotal', { trinkets, trinketTotal })
    // },
    // async checkApproveForest({ rootState, commit }) {
    //   const squireContract = getContract(rootState.web3.library, squire.abi, squire.address)
    //   const check = await userService.checkApproveForest(squireContract, rootState.web3.account, forest.address)
    //   commit('setApproveForest', check)
    //   console.log('setApproveForest', check)
    // },
    // async checkApproveCavern({ rootState, commit }) {
    //   const squireContract = getContract(rootState.web3.library, squire.abi, squire.address)
    //   const check = await userService.checkApproveCavern(squireContract, rootState.web3.account, cavern.address)
    //   commit('setApproveCavern', check)
    //   console.log('setApproveCavern', check)
    // },
    // async checkApproveMountain({ rootState, commit }) {
    //   const squireContract = getContract(rootState.web3.library, squire.abi, squire.address)
    //   const check = await userService.checkApproveMountain(squireContract, rootState.web3.account, mountain.address)
    //   commit('setApproveMountain', check)
    //   console.log('setApproveMountain', check)
    // },
    // async checkApproveTemple({ rootState, commit }) {
    //   const squireContract = getContract(rootState.web3.library, squire.abi, squire.address)
    //   const check = await userService.checkApproveTemple(squireContract, rootState.web3.account, temple.address)
    //   commit('setApproveTemple', check)
    //   console.log('setApproveTemple', check)
    // },
    // async checkWorship({ rootState, commit }) {
    //   const templeContract = getContract(rootState.web3.library, temple.abi, temple.address)
    //   const check = await userService.checkWorship(templeContract)
    //   commit('setApproveWorship', check)
    //   console.log('setApproveWorship', check)
    // },
    // async approveForest({ rootState, commit }) {
    //   try {
    //     const squireContract = getContract(rootState.web3.library, squire.abi, squire.address)
    //     await squireContract.methods.setApprovalForAll(forest.address, true).send({ from: rootState.web3.account })
    //     commit('setApproveForest', true)
    //   } catch (error) {
    //     throw new Error(error)
    //   }
    // },
    // async approveMountain({ rootState, commit }) {
    //   try {
    //     const squireContract = getContract(rootState.web3.library, squire.abi, squire.address)
    //     await squireContract.methods.setApprovalForAll(mountain.address, true).send({ from: rootState.web3.account })
    //     commit('setApproveMountain', true)
    //   } catch (error) {
    //     throw new Error(error)
    //   }
    // },
    // async approveCavern({ rootState, commit }) {
    //   try {
    //     const squireContract = getContract(rootState.web3.library, squire.abi, squire.address)
    //     await squireContract.methods.setApprovalForAll(cavern.address, true).send({ from: rootState.web3.account })
    //     commit('setApproveCavern', true)
    //   } catch (error) {
    //     throw new Error(error)
    //   }
    // },
    // async approveTemple({ rootState, commit }) {
    //   try {
    //     const squireContract = getContract(rootState.web3.library, squire.abi, squire.address)
    //     await squireContract.methods.setApprovalForAll(temple.address, true).send({ from: rootState.web3.account })
    //     commit('setApproveTemple', true)
    //   } catch (error) {
    //     throw new Error(error)
    //   }
    // },
  },
}
export default userModule

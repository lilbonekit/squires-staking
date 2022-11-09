import { koteStorage, koteSquires } from '@/config/constants/contracts'
import * as subgraphService from '@/services/subgraph.service'
import * as socketService from '@/services/socket.service'
import getContract from '@/utils/getContract'

const squiresModule = {
  namespaced: true,
  state: {
    approved: false,
    loading: false,
    squiresDeposited: [],
    squiresToDeposit: [],
    loot: [],
    isRestart: false,
  },
  getters: {},
  mutations: {
    setApproved(state, status) {
      state.approved = status
    },
    setLoading(state, status) {
      state.loading = status
    },
    setSquiresDeposited(state, payload) {
      state.squiresDeposited = payload
    },
    setSquiresToDeposit(state, payload) {
      state.squiresToDeposit = payload
    },
    setLoot(state, payload) {
      state.loot = payload
    },
    setIsRestart(state, status) {
      state.isRestart = status
    },
  },
  actions: {
    async getApproved({ rootState, commit }) {
      try {
        const squiresContract = getContract(rootState.web3.library, koteSquires.abi, koteSquires.address)
        const approvedStatus = await squiresContract.methods.isApprovedForAll(rootState.web3.account, koteStorage.address).call()
        commit('setApproved', approvedStatus)
        console.log('setApproved:', approvedStatus)
      } catch (error) {
        console.log(error)
      }
    },
    async approveSquiresContract({ rootState, commit }) {
      commit('setLoading', true)
      try {
        const squiresContract = getContract(rootState.web3.library, koteSquires.abi, koteSquires.address)
        await squiresContract.methods.setApprovalForAll(koteStorage.address, true).send({ from: rootState.web3.account })
        commit('setApproved', true)
        console.log('setApproved:', true)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async getSquiresToDeposit({ rootState, commit }) {
      commit('setLoading', true)
      commit('setSquiresToDeposit', [])
      try {
        const pullGraph = await subgraphService.getSquiresToDepositBySubgraph(rootState.web3.account)
        const squires = new Array(pullGraph)
        let squiresToDeposit = squires[0]
        rootState.items.squires.forEach(depositedSquire => {
          squiresToDeposit = squiresToDeposit.filter(squire => squire.id !== depositedSquire.tokenId)
        })
        commit(
          'setSquiresToDeposit',
          squiresToDeposit.sort((a, b) => a.id - b.id),
        )
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async depositSquires({ rootState, state, commit }, selectedSquiresId) {
      commit('setLoading', true)
      const koteStorageContract = getContract(rootState.web3.library, koteStorage.abi, koteStorage.address)
      const _contractAddress = new Array(selectedSquiresId.length).fill(koteSquires.address)
      const _id = selectedSquiresId
      const _amount = new Array(selectedSquiresId.length).fill(1)

      try {
        await koteStorageContract.methods.depositItems(_contractAddress, _id, _amount).send({ from: rootState.web3.account })
        let squiresToDeposit = state.squiresToDeposit
        selectedSquiresId.forEach(squireId => {
          squiresToDeposit = squiresToDeposit.filter(squire => squire.id !== squireId)
        })
        commit('setSquiresToDeposit', squiresToDeposit)
        console.log('setSquiresToDeposit:', squiresToDeposit)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async getSquiresNoneQuesting({ rootState, commit }) {
      commit('setLoading', true)
      commit('setSquiresDeposited', [])
      const squiresDepositedNQ = rootState.items.squires.filter(squire => squire.quest === 'None')
      commit(
        'setSquiresDeposited',
        squiresDepositedNQ.sort((a, b) => a.tokenId - b.tokenId),
      )
      commit('setLoading', false)
    },
    async getSquiresQuestingForest({ rootState, commit }) {
      commit('setLoading', true)
      commit('setSquiresDeposited', [])
      const squiresDepositedQF = rootState.items.squires.filter(squire => squire.quest === 'forest')
      commit(
        'setSquiresDeposited',
        squiresDepositedQF.sort((a, b) => a.tokenId - b.tokenId),
      )
      commit('setLoading', false)
    },
    async getSquiresQuestingTemple({ rootState, commit }) {
      commit('setLoading', true)
      commit('setSquiresDeposited', [])
      const squiresDepositedQT = rootState.items.squires.filter(squire => squire.quest === 'temple')
      commit(
        'setSquiresDeposited',
        squiresDepositedQT.sort((a, b) => a.tokenId - b.tokenId),
      )
      commit('setLoading', false)
    },
    async getSquiresQuestingCavern({ rootState, commit }) {
      commit('setLoading', true)
      commit('setSquiresDeposited', [])
      const squiresDepositedQC = rootState.items.squires.filter(squire => squire.quest === 'cavern')
      commit(
        'setSquiresDeposited',
        squiresDepositedQC.sort((a, b) => a.tokenId - b.tokenId),
      )
      commit('setLoading', false)
    },
    async getSquiresQuestingMountain({ rootState, commit }) {
      commit('setLoading', true)
      commit('setSquiresDeposited', [])
      const squiresDepositedQM = rootState.items.squires.filter(squire => squire.quest === 'mountain')
      commit(
        'setSquiresDeposited',
        squiresDepositedQM.sort((a, b) => a.tokenId - b.tokenId),
      )
      commit('setLoading', false)
    },
    async startQuest({ rootState, commit }, { questType, selectedSquiresId }) {
      commit('setLoading', true)
      try {
        await socketService.startQuest(rootState.socket.socketInstance, rootState.web3.library, rootState.web3.account, questType, selectedSquiresId)
        let squiresDepositedNQ = rootState.items.squires.filter(squire => squire.quest === 'None')
        selectedSquiresId.forEach(squireId => {
          squiresDepositedNQ = squiresDepositedNQ.filter(squire => squire.tokenId !== squireId)
        })
        commit(
          'setSquiresDeposited',
          squiresDepositedNQ.sort((a, b) => a.tokenId - b.tokenId),
        )
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async finishQuest({ rootState, commit }, { questType, selectedSquiresId }) {
      commit('setLoading', true)
      try {
        await socketService.finishQuest(rootState.socket.socketInstance, rootState.web3.library, rootState.web3.account, selectedSquiresId)
        let squiresDepositedQuesting = rootState.items.squires.filter(squire => squire.quest === questType)
        selectedSquiresId.forEach(squireId => {
          squiresDepositedQuesting = squiresDepositedQuesting.filter(squire => squire.tokenId !== squireId)
        })
        commit(
          'setSquiresDeposited',
          squiresDepositedQuesting.sort((a, b) => a.tokenId - b.tokenId),
        )
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
  },
}
export default squiresModule

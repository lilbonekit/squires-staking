import { koteStorage, squireTest } from '@/config/constants/contracts'
import * as subgraphService from '@/services/subgraph.service'
import getContract from '@/utils/getContract'

const squiresModule = {
  namespaced: true,
  state: {
    approved: false,
    loading: false,
    data: [],
    squiresToDeposit: [],
  },
  getters: {},
  mutations: {
    setApproved(state, status) {
      state.approved = status
    },
    setLoading(state, status) {
      state.loading = status
    },
    setData(state, payload) {
      state.data = payload
    },
    setSquiresToDeposit(state, payload) {
      state.squiresToDeposit = payload
    },
  },
  actions: {
    async getApproved({ rootState, commit }) {
      try {
        const squiresContract = getContract(rootState.web3.library, squireTest.abi, squireTest.address)
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
        const squiresContract = getContract(rootState.web3.library, squireTest.abi, squireTest.address)
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
      const _contractAddress = new Array(selectedSquiresId.length).fill(squireTest.address)
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
    async squiresNoQuesting({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await subgraphService.graphNQ(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
    async squiresQuestingForest({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await subgraphService.graphQF(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
    async squiresQuestingMountain({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await subgraphService.graphQM(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
    async squiresQuestingCavern({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await subgraphService.graphQC(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
    async squiresQuestingTemple({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await subgraphService.graphQT(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
  },
}
export default squiresModule

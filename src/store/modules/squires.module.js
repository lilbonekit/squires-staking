import * as userService from '@/services/user.service'

const squiresModule = {
  namespaced: true,
  state: { loading: false, data: [] },
  getters: {},
  mutations: {
    setLoading(state, status) {
      state.loading = status
    },
    setData(state, payload) {
      state.data = payload
    },
  },
  actions: {
    async squiresNonDeposit({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await userService.graphND(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit(
        'setData',
        squires[0].sort((a, b) => a.id - b.id),
      )
      commit('setLoading', false)
    },
    async squiresNoQuesting({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await userService.graphNQ(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
    async squiresQuestingForest({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await userService.graphQF(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
    async squiresQuestingMountain({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await userService.graphQM(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
    async squiresQuestingCavern({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await userService.graphQC(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
    async squiresQuestingTemple({ rootState, commit }) {
      commit('setLoading', true)
      commit('setData', [])
      const pullGraph = await userService.graphQT(rootState.web3.account)
      const squires = new Array(pullGraph)
      commit('setData', squires[0])
      commit('setLoading', false)
    },
  },
}
export default squiresModule

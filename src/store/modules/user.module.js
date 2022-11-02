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
  },
  actions: {
    async getBalance({ rootState, commit }) {
      const balance = await rootState.web3.library.eth.getBalance(rootState.web3.account)
      commit('setBalance', balance)
      console.log('setBalance', balance)
    },
  },
}
export default userModule

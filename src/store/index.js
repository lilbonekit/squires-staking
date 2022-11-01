import { createStore } from 'vuex'
import web3Module from '@/store/modules/web3.module'
import userModule from '@/store/modules/user.module'
import socketModule from './modules/socket.module'
import squiresModule from './modules/squires.module'

const store = createStore({
  state: { homePageLoading: false },
  getters: {},
  mutations: {
    setHomePageLoading(state, status) {
      state.homePageLoading = status
    },
  },
  actions: {},
  modules: {
    user: userModule,
    web3: web3Module,
    socket: socketModule,
    squires: squiresModule,
  },
})

export default store

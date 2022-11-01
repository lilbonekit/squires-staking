import { getLibrary } from '@/utils/web3'
import { parseInt } from 'lodash'
import { networkParams } from '@/config/constants/networks'
import Web3 from 'web3'

const web3Module = {
  namespaced: true,
  state: {
    web3Modal: null,
    library: getLibrary(),
    active: false,
    account: null,
    chainId: 0,
  },
  mutations: {
    setWeb3Modal(state, payload) {
      state.web3Modal = payload
    },
    setLibrary(state, payload) {
      state.library = payload
    },
    setActive(state, payload) {
      state.active = payload
    },
    setAccount(state, payload) {
      state.account = payload
    },
    setChainId(state, payload) {
      state.chainId = payload
    },
  },
  actions: {
    async connect({ state, commit, dispatch }) {
      try {
        const provider = await state.web3Modal.connect()
        const library = new Web3(provider)
        library.eth.transactionPollingTimeout = 12000
        commit('setLibrary', library)

        const accounts = await library.eth.getAccounts()
        if (accounts.length > 0) {
          commit('setAccount', String(accounts[0]).toLowerCase())
        }

        const chainId = await library.eth.getChainId()
        commit('setChainId', chainId)

        if (parseInt(chainId) !== 42161) {
          try {
            await library.currentProvider.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams[parseInt(42161)]],
            })
          } catch (error) {
            throw new Error(error)
          }
        }
        commit('setActive', true)
        console.log('connected')

        provider.on('accountsChanged', async accounts => {
          if (accounts.length > 0) {
            commit('setAccount', String(accounts[0]).toLowerCase())
          } else {
            await dispatch('resetApp')
          }
          console.log('accountsChanged', accounts[0])
        })
        provider.on('chainChanged', async chainId => {
          chainId = parseInt(chainId)
          commit('setChainId', chainId)
          console.log('chainChanged', chainId)
        })
      } catch (error) {
        throw new Error(error)
      }
    },

    async resetApp({ state, commit }) {
      try {
        await state.web3Modal.clearCachedProvider()
      } catch (error) {
        throw new Error(error)
      }
      commit('setAccount', null)
      commit('setActive', false)
      commit('setLibrary', getLibrary())
    },
  },
}

export default web3Module

import * as socketService from '@/services/socket.service'

const socketModule = {
  namespaced: true,
  state: {
    socketInstance: null,
  },
  mutations: {
    setSocketInstance(state, payload) {
      state.socketInstance = payload
    },
  },
  actions: {
    async initializeSocketInstance({ rootState, commit, dispatch }) {
      try {
        const socketInstance = socketService.init()
        commit('setSocketInstance', socketInstance)

        socketInstance.on('loggedin', user => {
          console.log('Login successful')
          console.log(user)

          let f = rootState.web3.library.utils.fromWei(user.fief, 'ether')
          f = Number(f).toFixed(2)
          f = parseFloat(f)

          commit('items/setFiefTotal', f, { root: true })
          commit('web3/setLoggedIn', true, { root: true })
          console.log('setFiefTotal:', f)
        })

        socketInstance.on('loginfail', response => {
          console.log(response)
        })

        socketInstance.on('squires', response => {
          if (response.success) {
            const squires = response.squires
            const squireTotal = socketService.getSquireTotal(squires)
            commit('items/setSquireTotal', squireTotal, { root: true })
            console.log('setSquireTotal:', squireTotal)
          } else {
            console.log(response.message)
          }
        })

        socketInstance.on('update squire', updatedSquire => {
          const squires = rootState.items.squires.map(squire => {
            if (squire.tokenId === updatedSquire.tokenId) squire = updatedSquire
            return squire
          })
          const squireTotal = socketService.getSquireTotal(squires)
          commit('items/setSquireTotal', squireTotal, { root: true })
          console.log('setSquireTotal:', squireTotal)
        })

        socketInstance.on('update fief', fief => {
          let f = rootState.web3.library.utils.fromWei(fief, 'ether')
          f = Number(f).toFixed(2)
          f = parseFloat(f)

          commit('items/setFiefTotal', f, { root: true })
          console.log('setFiefTotal', f)
        })

        socketInstance.on('spamming', () => {
          console.log('Stop spamming.')
        })

        socketInstance.on('items', response => {
          if (response.success) {
            const items = response.items
            commit('items/setInventoryItems', items, { root: true })
            console.log('inventoryItems:', items)
            const inventoryItems = socketService.getInventoryItemsTotal(items)
            commit('items/setPotionTotal', inventoryItems[0], { root: true })
            commit('items/setRingTotal', inventoryItems[1], { root: true })
            commit('items/setTrinketTotal', inventoryItems[2], { root: true })
            if (rootState.items.selectedItemsToWithdraw.length > 0) socketService.requestWithdrawOrders(socketInstance)
          } else {
            console.log(response.message)
          }
        })

        socketInstance.on('deposit', response => {
          if (response.success) {
            const squires = response.squires
            const squireTotal = socketService.getSquireTotal(squires)
            commit('items/setSquireTotal', squireTotal, { root: true })
            console.log('setSquireTotal:', squireTotal)
            const items = response.items
            commit('items/setInventoryItems', items, { root: true })
            console.log('inventoryItems:', items)
            const inventoryItems = socketService.getInventoryItemsTotal(items)
            commit('items/setPotionTotal', inventoryItems[0], { root: true })
            commit('items/setRingTotal', inventoryItems[1], { root: true })
            commit('items/setTrinketTotal', inventoryItems[2], { root: true })
          } else {
            console.log(response.message)
          }
        })

        socketInstance.on('depositsuccess', response => {
          console.log('depositSuccess:', response)
        })

        socketInstance.on('erc20depositsuccess', response => {
          console.log('erc20depositSuccess:', response)
        })

        socketInstance.on('show return', questType => {
          commit('squires/setLoading', false, { root: true })
          console.log('questType:', questType)
        })

        socketInstance.on('quest data', response => {
          console.log('questData:', response)
          commit('squires/setLoot', response, { root: true })
          commit('squires/setLoading', false, { root: true })
        })

        socketInstance.on('withdraworders', response => {
          if (rootState.items.selectedItemsToWithdraw.length > 0) {
            console.log('withdraworders:', response)
            commit('items/setItemsOrdered', response.items1155, { root: true })
            commit('items/setLoading', false, { root: true })
          }
          if (rootState.squires.squiresIdToWithdraw.length > 0) dispatch('squires/withdrawSquires', response.squires, { root: true })
        })
      } catch (error) {
        throw new Error(error)
      }
    },

    async login({ state, rootState }) {
      try {
        await socketService.login(state.socketInstance, rootState.web3.library, rootState.web3.account)
      } catch (error) {
        throw new Error(error)
      }
    },

    getSquires({ state }) {
      try {
        socketService.getSquires(state.socketInstance)
      } catch (error) {
        throw new Error(error)
      }
    },

    getInventoryItems({ state }) {
      try {
        socketService.getInventoryItems(state.socketInstance)
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}

export default socketModule

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
    async initializeSocketInstance({ commit, rootState }) {
      try {
        const socketInstance = socketService.init()
        commit('setSocketInstance', socketInstance)

        socketInstance.on('loggedin', data => {
          console.log('Login successful')
          console.log(data)

          let f = rootState.web3.library.utils.fromWei(data.fief, 'ether')
          f = Number(f).toFixed(2)
          f = parseFloat(f)

          commit('items/setFiefTotal', f, { root: true })
          commit('web3/setLoggedIn', true, { root: true })
        })

        socketInstance.on('squires', response => {
          if (response.success) {
            const squires = response.squires
            const squireTotal = socketService.getSquireTotal(squires)
            commit('items/setSquireTotal', squireTotal, { root: true })
            console.log('setSquireTotal:', squireTotal)
          } else {
            throw new Error(response.message)
          }
        })

        socketInstance.on('update squire', updatedSquire => {
          const squires = rootState.items.squires.map(squire => {
            if (squire.tokenId == updatedSquire.tokenId) squire = updatedSquire
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
          if (response) {
            const items = response.items
            commit('items/setInventoryItems', items, { root: true })
            console.log('inventoryItems:', items)
            const inventoryItems = socketService.getInventoryItemsTotal(items, rootState)
            commit('items/setPotionTotal', inventoryItems[0], { root: true })
            commit('items/setRingTotal', inventoryItems[1], { root: true })
            commit('items/setTrinketTotal', inventoryItems[2], { root: true })
            commit('setHomePageLoading', false, { root: true })
          }
        })

        socketInstance.on('show return', questType => {
          commit('squires/setLoading', false, { root: true })
          console.log('questType:', questType)
        })

        socketInstance.on('quest data', response => {
          console.log('questData:', response)
          const questData = response
          commit('squires/setLoot', questData, { root: true })
          let { potions, potionTotal, rings, ringTotal, trinkets, trinketTotal } = rootState.items
          questData.forEach(data => {
            data.items.forEach(item => {
              console.log('item:', item)
              if (item.type === 'potion') {
                potionTotal += 1
                potions[item.id - 100] += 1
                commit('items/setPotionTotal', { potions, potionTotal }, { root: true })
              }
              if (item.type === 'trinket') {
                trinketTotal += 1
                trinkets[item.id - 100] += 1
                commit('items/setTrinketTotal', { trinkets, trinketTotal }, { root: true })
              }
              if (item.type === 'ring') {
                ringTotal += 1
                rings[item.id - 100] += 1
                commit('items/setRingTotal', { rings, ringTotal }, { root: true })
              }
            })
          })
          commit('squires/setLoading', false, { root: true })
        })
      } catch (error) {
        commit('squires/setLoading', false, { root: true })
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

    async getSquires({ state }) {
      try {
        socketService.getSquires(state.socketInstance)
      } catch (error) {
        throw new Error(error)
      }
    },

    async getInventoryItems({ state }) {
      try {
        socketService.getInventoryItems(state.socketInstance)
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}

export default socketModule

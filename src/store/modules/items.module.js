import { koteStorage, fief, squirePotions, squireRings, squireTrinkets } from '@/config/constants/contracts'
import * as subgraphService from '@/services/subgraph.service'
import * as socketService from '@/services/socket.service'
import getContract from '@/utils/getContract'
import { ringItems, potionItems, trinketItems } from '@/config/constants/inventoryItems'

const itemsModule = {
  namespaced: true,
  state: {
    loading: false,
    approvedFief: false,
    approvedPotions: false,
    approvedTrinkets: false,
    approvedRings: false,
    fiefToDeposit: 0,
    itemsToDeposit: [],
    itemsToWithdraw: [],
    itemsOrdered: [],
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
    inventoryItems: [],
  },
  getters: {},
  mutations: {
    setLoading(state, status) {
      state.loading = status
    },
    setApprovedFief(state, status) {
      state.approvedFief = status
    },
    setApprovedPotions(state, status) {
      state.approvedPotions = status
    },
    setApprovedTrinkets(state, status) {
      state.approvedTrinkets = status
    },
    setApprovedRings(state, status) {
      state.approvedRings = status
    },
    setItemsToDeposit(state, payload) {
      state.itemsToDeposit = payload
    },
    setItemsToWithdraw(state, payload) {
      state.itemsToWithdraw = payload
    },
    setItemsOrdered(state, payload) {
      state.itemsOrdered = payload
    },
    setFiefToDeposit(state, payload) {
      state.fiefToDeposit = payload
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
    setInventoryItems(state, payload) {
      state.inventoryItems = payload
    },
  },
  actions: {
    async getApprovedFief({ rootState, commit }) {
      try {
        const fiefContract = getContract(rootState.web3.library, fief.abi, fief.address)
        let approvedAmount = await fiefContract.methods.allowance(rootState.web3.account, koteStorage.address).call()
        approvedAmount = rootState.web3.library.utils.fromWei(approvedAmount, 'ether')
        approvedAmount = Number(approvedAmount).toFixed(2)
        approvedAmount = parseFloat(approvedAmount)
        commit('setApprovedFief', approvedAmount > 0 ? true : false)
        console.log('setApprovedFief:', approvedAmount > 0 ? true : false)
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },
    async approveFiefContract({ rootState, commit }) {
      commit('setLoading', true)
      try {
        const fiefContract = getContract(rootState.web3.library, fief.abi, fief.address)
        await fiefContract.methods
          .approve(koteStorage.address, rootState.web3.library.utils.toWei('1', 'gether'))
          .send({ from: rootState.web3.account })
        commit('setApprovedFief', true)
        console.log('setApprovedFief:', true)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async getFiefToDeposit({ rootState, commit }) {
      commit('setLoading', true)
      commit('setFiefToDeposit', 0)
      try {
        const pullGraph = await subgraphService.getFiefToDepositBySubgraph(rootState.web3.account)
        let fiefToDeposit = pullGraph ? rootState.web3.library.utils.fromWei(pullGraph.amount, 'ether') : 0
        fiefToDeposit = Number(fiefToDeposit).toFixed(2)
        fiefToDeposit = parseFloat(fiefToDeposit)
        commit('setFiefToDeposit', fiefToDeposit)
        console.log('setFiefToDeposit:', fiefToDeposit)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async depositFief({ rootState, state, commit }, fiefAmount) {
      commit('setLoading', true)
      const koteStorageContract = getContract(rootState.web3.library, koteStorage.abi, koteStorage.address)

      try {
        await koteStorageContract.methods
          .ERC20Deposit(rootState.web3.library.utils.toWei(String(fiefAmount), 'ether'))
          .send({ from: rootState.web3.account })

        commit('setFiefToDeposit', state.fiefToDeposit - fiefAmount)
        commit('setFiefTotal', state.fiefTotal + fiefAmount)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async getApprovedPotions({ rootState, commit }) {
      try {
        const potionsContract = getContract(rootState.web3.library, squirePotions.abi, squirePotions.address)
        const approvedStatus = await potionsContract.methods.isApprovedForAll(rootState.web3.account, koteStorage.address).call()
        commit('setApprovedPotions', approvedStatus)
        console.log('setApprovedPotions:', approvedStatus)
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },
    async getApprovedTrinkets({ rootState, commit }) {
      try {
        const trinketsContract = getContract(rootState.web3.library, squireTrinkets.abi, squireTrinkets.address)
        const approvedStatus = await trinketsContract.methods.isApprovedForAll(rootState.web3.account, koteStorage.address).call()
        commit('setApprovedTrinkets', approvedStatus)
        console.log('setApprovedTrinkets:', approvedStatus)
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },
    async getApprovedRings({ rootState, commit }) {
      try {
        const ringsContract = getContract(rootState.web3.library, squireRings.abi, squireRings.address)
        const approvedStatusPortion = await ringsContract.methods.isApprovedForAll(rootState.web3.account, koteStorage.address).call()
        commit('setApprovedRings', approvedStatusPortion)
        console.log('setApprovedRings:', approvedStatusPortion)
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },
    async approvePotionsContract({ rootState, commit }) {
      commit('setLoading', true)
      try {
        const potionsContract = getContract(rootState.web3.library, squirePotions.abi, squirePotions.address)
        await potionsContract.methods.setApprovalForAll(koteStorage.address, true).send({ from: rootState.web3.account })
        commit('setApprovedPotions', true)
        console.log('setApprovedPotions:', true)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async approveTrinketsContract({ rootState, commit }) {
      commit('setLoading', true)
      try {
        const trinketsContract = getContract(rootState.web3.library, squireTrinkets.abi, squireTrinkets.address)
        await trinketsContract.methods.setApprovalForAll(koteStorage.address, true).send({ from: rootState.web3.account })
        commit('setApprovedTrinkets', true)
        console.log('setApprovedTrinkets:', true)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async approveRingsContract({ rootState, commit }) {
      commit('setLoading', true)
      try {
        const ringsContract = getContract(rootState.web3.library, squireRings.abi, squireRings.address)
        await ringsContract.methods.setApprovalForAll(koteStorage.address, true).send({ from: rootState.web3.account })
        commit('setApprovedRings', true)
        console.log('setApprovedRings:', true)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async getItemsToDeposit({ rootState, commit }, itemType) {
      commit('setLoading', true)
      commit('setItemsToDeposit', [])
      try {
        const pullGraph = await subgraphService.getItemsToDepositBySubgraph(rootState.web3.account)
        const contractAddressByItemType = { potion: squirePotions.address, ring: squireRings.address, trinket: squireTrinkets.address }
        const itemsByItemType = { potion: potionItems, ring: ringItems, trinket: trinketItems }
        let itemsToDeposit = pullGraph.filter(
          inventoryItem =>
            String(inventoryItem.contract).toLowerCase() === String(contractAddressByItemType[itemType]).toLowerCase() &&
            Number(inventoryItem.itemamount) > 0,
        )
        itemsToDeposit = itemsToDeposit.map(itemToDeposit =>
          Object.assign(itemsByItemType[itemType].filter(item => item.id === itemToDeposit.itemid - 100)[0], {
            amount: Number(itemToDeposit.itemamount),
          }),
        )
        commit('setItemsToDeposit', itemsToDeposit)
        console.log('setItemsToDeposit:', itemsToDeposit)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async depositItems({ rootState, state, commit }, { selectedItems, itemType }) {
      commit('setLoading', true)
      const koteStorageContract = getContract(rootState.web3.library, koteStorage.abi, koteStorage.address)
      const contractAddressByItemType = { potion: squirePotions.address, ring: squireRings.address, trinket: squireTrinkets.address }
      const _contractAddress = new Array(selectedItems.length).fill(contractAddressByItemType[itemType])
      const _id = selectedItems.map(item => item.id + 100)
      const _amount = selectedItems.map(item => item.amount)

      try {
        await koteStorageContract.methods.depositItems(_contractAddress, _id, _amount).send({ from: rootState.web3.account })
        let itemsToDeposit = state.itemsToDeposit
        selectedItems.forEach(item => {
          itemsToDeposit = itemsToDeposit.filter(itemToDeposit => itemToDeposit.id !== item.id)
        })
        commit('setItemsToDeposit', itemsToDeposit)
        console.log('setItemsToDeposit:', itemsToDeposit)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    getItemsToWithdraw({ state, commit }, itemType) {
      commit('setLoading', true)
      commit('setItemsToWithdraw', [])
      let itemsToWithdraw = []
      setTimeout(() => {
        state.inventoryItems.forEach(item => {
          if (item.type === itemType) itemsToWithdraw.push(item)
        })
        commit(
          'setItemsToWithdraw',
          itemsToWithdraw.sort((a, b) => a.id - b.id),
        )
        console.log('setItemsToWithdraw:', itemsToWithdraw)
        commit('setLoading', false)
      }, 500)
    },
    async requestWithdraw1155({ rootState, state, commit }, { selectedItems, itemType }) {
      try {
        commit('setLoading', true)
        await socketService.requestWithdraw1155(
          rootState.socket.socketInstance,
          rootState.web3.library,
          rootState.web3.account,
          selectedItems.map(item => item.id),
          selectedItems.map(item => item.amount),
          itemType,
        )
        let itemsToWithdraw = state.itemsToWithdraw
        selectedItems.forEach(selectedItem => {
          itemsToWithdraw = itemsToWithdraw.filter(item => item.id !== selectedItem.id)
        })
        commit(
          'setItemsToWithdraw',
          itemsToWithdraw.sort((a, b) => a.id - b.id),
        )
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    requestWithdrawOrders({ rootState, commit }) {
      commit('setLoading', true)
      commit('setItemsOrdered', [])
      try {
        socketService.requestWithdrawOrders(rootState.socket.socketInstance)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
    async withdrawItems({ rootState, state, commit }, items1155) {
      commit('setLoading', true)
      const koteStorageContract = getContract(rootState.web3.library, koteStorage.abi, koteStorage.address)
      const _id = items1155.map(item1155 => item1155.withdrawl.id)
      const _amount = items1155.map(item1155 => item1155.withdrawl.amount)
      const _contract = items1155.map(item1155 => item1155.withdrawl.contract)
      const _nonce = items1155.map(item1155 => item1155.withdrawl.nonce)
      const _standard = items1155.map(item1155 => Number(item1155.withdrawl.standard))
      const signature = items1155.map(item1155 => item1155.signedMessage)
      try {
        await koteStorageContract.methods
          .withdrawMany1155(_id, _amount, _contract, _nonce, _standard, signature)
          .send({ from: rootState.web3.account })
        let itemsOrdered = state.itemsOrdered
        items1155.forEach(item1155 => {
          itemsOrdered = itemsOrdered.filter(item => item.withdrawl.id !== item1155.withdrawl.id)
        })
        commit('setItemsOrdered', itemsOrdered)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
      }
    },
  },
}
export default itemsModule

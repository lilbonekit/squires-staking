import { koteStorage, fief, squirePotions, squireRings, squireTrinkets } from '@/config/constants/contracts'
import * as subgraphService from '@/services/subgraph.service'
import getContract from '@/utils/getContract'
import { ringItems, potionItems, trinketItems } from '@/config/constants/inventoryItems'

const itemsModule = {
  namespaced: true,
  state: {
    loading: false,
    approvedFief: false,
    approvedItems: false,
    fiefToDeposit: 0,
    itemsToDeposit: [],
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
    setApprovedItems(state, status) {
      state.approvedItems = status
    },
    setItemsToDeposit(state, payload) {
      state.itemsToDeposit = payload
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
        let fiefToDeposit = rootState.web3.library.utils.fromWei(pullGraph.amount, 'ether')
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
    async getApprovedItems({ rootState, commit }) {
      try {
        const potionContract = getContract(rootState.web3.library, squirePotions.abi, squirePotions.address)
        const ringContract = getContract(rootState.web3.library, squireRings.abi, squireRings.address)
        const trinketContract = getContract(rootState.web3.library, squireTrinkets.abi, squireTrinkets.address)
        const approvedStatusPortion = await potionContract.methods.isApprovedForAll(rootState.web3.account, koteStorage.address).call()
        const approvedStatusring = await ringContract.methods.isApprovedForAll(rootState.web3.account, koteStorage.address).call()
        const approvedStatusTrinket = await trinketContract.methods.isApprovedForAll(rootState.web3.account, koteStorage.address).call()
        const approvedItems = approvedStatusPortion && approvedStatusring && approvedStatusTrinket
        commit('setApprovedItems', approvedItems)
        console.log('setApprovedItems:', approvedItems)
      } catch (error) {
        console.log(error)
      }
    },
    async approveItemsContract({ rootState, commit }) {
      commit('setLoading', true)
      try {
        const potionContract = getContract(rootState.web3.library, squirePotions.abi, squirePotions.address)
        const ringContract = getContract(rootState.web3.library, squireRings.abi, squireRings.address)
        const trinketContract = getContract(rootState.web3.library, squireTrinkets.abi, squireTrinkets.address)
        await potionContract.methods.setApprovalForAll(koteStorage.address, true).send({ from: rootState.web3.account })
        await ringContract.methods.setApprovalForAll(koteStorage.address, true).send({ from: rootState.web3.account })
        await trinketContract.methods.setApprovalForAll(koteStorage.address, true).send({ from: rootState.web3.account })
        commit('setApprovedItems', true)
        console.log('setApprovedItems:', true)
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
      console.log('selectedItems:', selectedItems)
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
  },
}
export default itemsModule

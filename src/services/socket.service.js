import { io } from 'socket.io-client'

export const init = () => {
  const socket = io('https://kote-off-chain.herokuapp.com/')
  return socket
}

export const login = async (socket, library, selectedAccount) => {
  const expiryTime = Math.floor(Date.now() / 1000) + 600
  const action = 'Login'

  const hash = 'KOTE\n' + 'Action: ' + action + '\nSignature Expires: ' + expiryTime
  const sign = await library.eth.personal.sign(hash, selectedAccount)
  socket.emit('login', action, sign, selectedAccount, expiryTime)
}

export const getSquires = socket => {
  socket.emit('getsquires')
}

export const startQuest = async (socket, library, selectedAccount, questType, ids) => {
  const expiryTime = Math.floor(Date.now() / 1000) + 600
  const action = 'Quest'

  const hash = 'KOTE\n' + 'Action: ' + action + '\nSignature Expires: ' + expiryTime
  const sign = await library.eth.personal.sign(hash, selectedAccount)

  socket.emit('quest', action, sign, selectedAccount, expiryTime, questType, ids)
}

export const finishQuest = async (socket, library, selectedAccount, ids) => {
  const expiryTime = Math.floor(Date.now() / 1000) + 600
  const action = 'Finish Quest'

  const hash = 'KOTE\n' + 'Action: ' + action + '\nSignature Expires: ' + expiryTime
  const sign = await library.eth.personal.sign(hash, selectedAccount)

  socket.emit('finishQuest', action, sign, selectedAccount, expiryTime, ids)
}

export const getInventoryItems = socket => {
  socket.emit('get items')
}

export const requestWithdraw1155 = async (socket, library, selectedAccount, id, amount, type) => {
  var expiryTime = Math.floor(Date.now() / 1000) + 600
  var action = 'Withdraw'

  var hash = 'KOTE\n' + 'Action: ' + action + '\nSignature Expires: ' + expiryTime
  var sig = await library.eth.personal.sign(hash, selectedAccount)

  socket.emit('withdraw item', action, sig, selectedAccount, expiryTime, id, amount, type)
}

export const requestWithdrawOrders = socket => {
  socket.emit('getwithdraworders')
}

export const requestWithdrawSquires = async (socket, library, selectedAccount, ids) => {
  var expiryTime = Math.floor(Date.now() / 1000) + 600
  var action = 'Withdraw Squire'

  var hash = 'KOTE\n' + 'Action: ' + action + '\nSignature Expires: ' + expiryTime
  var sig = await library.eth.personal.sign(hash, selectedAccount)

  socket.emit('withdraw squire', action, sig, selectedAccount, expiryTime, ids)
}

export const getSquireTotal = squires => {
  const squireTotal = squires.length
  let squireTotalQuesting = 0
  let squireTotalTown = 0
  squires.forEach(squire => {
    if (squire.quest !== 'None') squireTotalQuesting += 1
    else squireTotalTown += 1
  })
  return { squires, squireTotal, squireTotalQuesting, squireTotalTown }
}

export const getInventoryItemsTotal = items => {
  let potions = new Array(25).fill(0)
  let rings = new Array(25).fill(0)
  let trinkets = new Array(27).fill(0)
  let potionTotal = 0
  let ringTotal = 0
  let trinketTotal = 0

  items.forEach(item => {
    if (item.type === 'potion') {
      potions[item.baseId] = item.amount
      potionTotal += item.amount
    }
    if (item.type === 'ring') {
      rings[item.baseId] = item.amount
      ringTotal += item.amount
    }
    if (item.type === 'trinket') {
      trinkets[item.baseId] = item.amount
      trinketTotal += item.amount
    }
  })

  return [
    { potions, potionTotal },
    { rings, ringTotal },
    { trinkets, trinketTotal },
  ]
}

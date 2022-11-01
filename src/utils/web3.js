import Web3 from 'web3'

const POLLING_INTERVAL = 12000
const RPC_URL = process.env.VUE_APP_HTTP_RPC_URL

export const getLibrary = () => {
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL) || Web3.givenProvider
  const library = new Web3(httpProvider)
  library.eth.transactionPollingTimeout = POLLING_INTERVAL
  return library
}

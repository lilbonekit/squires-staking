import WalletConnectProvider from '@walletconnect/web3-provider'
// import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
// import Portis from '@portis/web3'
// import Fortmatic from 'fortmatic'
// import Squarelink from 'squarelink'

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'e49a1638d7a84eff8c8558e734337661',
    },
  },
  // walletlink: {
  //   package: CoinbaseWalletSDK,
  //   options: {
  //     infuraId: process.env.INFURA_KEY,
  //   },
  // },
  // portis: {
  //   package: Portis,
  //   options: {
  //     id: process.env.INFURA_KEY,
  //   },
  // },
  // fortmatic: {
  //   package: Fortmatic,
  //   options: {
  //     key: process.env.INFURA_KEY,
  //   },
  // },
  // squarelink: {
  //   package: Squarelink,
  //   options: {
  //     id: process.env.INFURA_KEY,
  //   },
  // },
}

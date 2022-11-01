import axios from 'axios'
import { parseInt } from 'lodash'

export const graphND = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/kote-owner-tracker`, {
    query: `
  {
    squires (
    where: {
    owner: "${account}"
        }
    )
  
    {
      id
    }
  }`,
  })
  return results.data.data.squires
}

export const graphNQ = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/kote-live`, {
    query: `
  {
    squires (
    where: {
    owner: "${account}"
    questing: false
        }
    )
  
    {
      id
      faith
      luck
      strength
      wisdom
      genesis
      type
      questing
      owner
      finish
      lastfief
      lastupgrade
      image
      typename
    }
  }`,
  })
  return results.data.data.squires
}

export const graphQOld = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/kote-live`, {
    query: `
  {
    squires (
    where: {owner: "${account}"
    questing: true
        }
    )
  
    {
      id
      faith
      luck
      strength
      type
      wisdom
      genesis
      owner
      questing
    }
  }`,
  })
  return results.data.data.squires
}

export const graphQF = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/kote-live`, {
    query: `
  {
    squires (
    where: {
    owner: "${account}"
    questing: true
    questtype: "forest"
        }
    )
  
    {
      id
      faith
      luck
      strength
      wisdom
      genesis
      type
      questing
      owner
      finish
      lastfief
      lastupgrade
      image
      typename
    }
  }`,
  })
  return results.data.data.squires
}

export const graphQC = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/kote-live`, {
    query: `
  {
    squires (
    where: {
    owner: "${account}"
    questing: true
    questtype: "cavern"
        }
    )
  
    {
      id
      faith
      luck
      strength
      wisdom
      genesis
      type
      questing
      owner
      finish
      lastfief
      lastupgrade
      image
      typename
    }
  }`,
  })
  return results.data.data.squires
}

export const graphQM = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/kote-live`, {
    query: `
  {
    squires (
    where: {
    owner: "${account}"
    questing: true
    questtype: "mountain"
        }
    )
  
    {
      id
      faith
      luck
      strength
      wisdom
      genesis
      type
      questing
      owner
      finish
      lastfief
      lastupgrade
      image
      typename
    }
  }`,
  })
  return results.data.data.squires
}

export const graphQT = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/kote-live`, {
    query: `
  {
    squires (
    where: {
    owner: "${account}"
    questing: true
    questtype: "temple"
        }
    )
  
    {
      id
      faith
      luck
      strength
      wisdom
      genesis
      type
      questing
      owner
      finish
      lastfief
      lastupgrade
      image
      typename
    }
  }`,
  })
  return results.data.data.squires
}

export const graph = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/kote-live`, {
    query: `
  {
    squires (
    where: {
    owner: "${account}"
        }
    )
  
    {
      id
      faith
      luck
      strength
      wisdom
      genesis
      type
      questing
      questtype
      owner
      finish
      lastfief
      lastupgrade
      image
      typename
      lastitemid
      lastitemtype
      lastitemname
      lastitemlevel
      lastitemclass
      lastitemimage
      lastitemrarity
    }
  }`,
  })
  return results.data.data.squires
}

// export const getFiefTotal = async (fiefContractInstance, account) => {
//   let fiefTotal = await fiefContractInstance.methods.balanceOf(account).call()
//   if (parseInt(fiefTotal) === 0) return 0
//   else fiefTotal = parseInt(fiefTotal) / Math.pow(10, 18)

//   try {
//     return BigInt(fiefTotal)
//   } catch (err) {
//     return Math.round(fiefTotal)
//   }
// }

// export const getSquireTotal = async account => {
//   const pullGraph = await graph(account)

//   const squires = new Array(pullGraph)

//   const squireTotal = squires[0].length

//   let squireTotalQuesting = 0
//   let squireTotalTown = 0
//   for (let i = 0; i < squires[0].length; i++) {
//     if (squires[0][i].questing == true) {
//       squireTotalQuesting += 1
//     } else {
//       squireTotalTown += 1
//     }
//   }
//   return { squires: squires[0], squireTotal, squireTotalQuesting, squireTotalTown }
// }

// export const getPotionTotal = async (potionContractInstance, account) => {
//   let potions = []
//   let potionTotal = 0
//   for (let i = 100; i < 125; i++) {
//     const potion = parseInt(await potionContractInstance.methods.balanceOf(account, i).call())
//     potionTotal += potion
//     potions.push(potion)
//   }
//   return { potions, potionTotal }
// }

// export const getRingTotal = async (ringContractInstance, account) => {
//   let rings = []
//   let ringTotal = 0
//   for (let i = 100; i < 125; i++) {
//     const ring = parseInt(await ringContractInstance.methods.balanceOf(account, i).call())
//     ringTotal += ring
//     rings.push(ring)
//   }
//   return { rings, ringTotal }
// }

// export const getTrinketTotal = async (trinketContractInstance, account) => {
//   let trinkets = []
//   let trinketTotal = 0
//   for (let i = 100; i < 127; i++) {
//     const trinket = parseInt(await trinketContractInstance.methods.balanceOf(account, i).call())
//     trinketTotal += trinket
//     trinkets.push(trinket)
//   }
//   return { trinkets, trinketTotal }
// }

// export const checkApproveForest = async (squireContractInstance, account, forestAddress) => {
//   const check = await squireContractInstance.methods.isApprovedForAll(account, forestAddress).call()
//   return check
// }

// export const checkApproveCavern = async (squireContractInstance, account, cavernAddress) => {
//   const check = await squireContractInstance.methods.isApprovedForAll(account, cavernAddress).call()
//   return check
// }

// export const checkApproveMountain = async (squireContractInstance, account, mountainAddress) => {
//   const check = await squireContractInstance.methods.isApprovedForAll(account, mountainAddress).call()
//   return check
// }

// export const checkApproveTemple = async (squireContractInstance, account, templeAddress) => {
//   const check = await squireContractInstance.methods.isApprovedForAll(account, templeAddress).call()
//   return check
// }

// export const checkWorship = async templeContractInstance => {
//   const check = await templeContractInstance.methods.canWorship().call()
//   return check
// }

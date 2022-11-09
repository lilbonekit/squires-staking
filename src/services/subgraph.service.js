import axios from 'axios'

export const getSquiresToDepositBySubgraph = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/squires-goerli`, {
    query: `
  {
    squires(where:{owner:"${account}"}) {
      id
      faith
      luck
      wisdom
      strength
      genesis
      image
      type
    }
  }`,
  })
  return results.data.data.squires
}

export const getFiefToDepositBySubgraph = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/squires-goerli`, {
    query: `
  {
    fief(id:"${account}") {
      amount
    }
  }`,
  })
  return results.data.data.squires
}

export const getItemsToDepositBySubgraph = async account => {
  const results = await axios.post(`https://api.thegraph.com/subgraphs/name/0x-g/squires-goerli`, {
    query: `
  {
    inventoryItems(where:{owner_contains_nocase:"${account}"}) {
      itemid
      itemamount
      owner
      contract
    }
  }`,
  })
  return results.data.data.squires
}

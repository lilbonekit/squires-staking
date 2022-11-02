import axios from 'axios'

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

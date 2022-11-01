const getContract = (library, abi, address) => {
  return new library.eth.Contract(abi, address)
}

export default getContract

export const numberOrNull = value => {
  if (value === null) {
    return null
  }
  const valueNum = Number(value)
  return Number.isNaN(valueNum) ? null : valueNum
}

export const getMultiplier = (total, amount) => {
  if (total === 0 || amount === 0) {
    return 0
  }
  return total / amount
}

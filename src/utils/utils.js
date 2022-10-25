const getChatId = (idOne, idTwo) => {
  return [idOne, idTwo].sort().join('')
}

const getUniqueItemsByProperties = (items, propNames) => {
  const ids = items.map((o) => o[propNames])

  const filtered = items.filter(({ id }, index) => !ids.includes(id, index + 1))

  return filtered
}

export { getChatId, getUniqueItemsByProperties }

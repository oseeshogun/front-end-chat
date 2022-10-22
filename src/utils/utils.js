const getChatId = (idOne, idTwo) => {
  return [idOne, idTwo].sort().join('')
}

const isPropValuesEqual = (subject, target, propNames) =>
  propNames.every((propName) => subject[propName] === target[propName])

const getUniqueItemsByProperties = (items, propNames) => {
  const propNamesArray = Array.from(propNames)

  return items.filter(
    (item, index, array) =>
      index ===
      array.findIndex((foundItem) =>
        isPropValuesEqual(foundItem, item, propNamesArray)
      )
  )
}

export { getChatId, getUniqueItemsByProperties }

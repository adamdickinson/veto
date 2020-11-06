export const areUnorderedListsEqual = (lists: any[][]) => {
  lists = [...lists]
  while (lists[0].length) {
    const key = lists[0][0]

    for (let index = 0; index < lists.length; index++) {
      const list = lists[index]
      const filtered = list.filter(item => item !== key)
      if (list.length - filtered.length !== 1)
        return false

      lists[index] = filtered
    }
  }

  return !lists.some(list => list.length > 0)
}

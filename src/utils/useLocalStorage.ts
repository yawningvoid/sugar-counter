export function getFromLocalStorage<T>(key: string): T | null {
  enum Key {
    LIST = 'list',
    DATE = 'date',
    CALENDAR = 'calendar',
    MEASUREMENT = 'measurement',
    GOAL = 'goal',
    COUNTER = 'counter',
  }
  const storedData = localStorage.getItem(key)

  if (storedData) {
    const result =
      JSON.parse(storedData)[Key.LIST] ||
      JSON.parse(storedData)[Key.DATE] ||
      JSON.parse(storedData)[Key.CALENDAR] ||
      JSON.parse(storedData)[Key.MEASUREMENT] ||
      JSON.parse(storedData)[Key.GOAL] ||
      JSON.parse(storedData)[Key.COUNTER]
    if (result) {
      return result
    }
  }

  return null
}

export function saveToLocalStorage<T>(key: string, data: T) {
  const setItem = (obj: Record<string, T | string>) => {
    localStorage.setItem(key, JSON.stringify(obj))
  }

  switch (key) {
    case 'initialItems':
    case 'selectedItems':
      setItem({ list: data })
      break
    case 'lastModifiedTimestamp':
      setItem({ date: new Date().toLocaleDateString() })
      break
    case 'calendar':
      setItem({ calendar: data })
      break
      case 'measurement':
        setItem({ measurement: data })
        break
      case 'goal':
        setItem({ goal: data })
        break
    case 'counter':
      setItem({ counter: data })
      break
  }
}

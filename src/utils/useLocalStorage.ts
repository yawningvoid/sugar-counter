
export default function useLocalStorage () {
  function getFromLocalStorage<T>(key: string): T | null {
    enum Key {
      LIST = 'list',
      DATE = 'date',
      CALENDAR = 'calendar',
      COUNTER = 'counter'
    }
    const storedData = localStorage.getItem(key)
  
    if (storedData) {
      const result = JSON.parse(storedData)[Key.LIST] || JSON.parse(storedData)[Key.DATE] || JSON.parse(storedData)[Key.CALENDAR] || JSON.parse(storedData)[Key.COUNTER]
      if (result) {
        return result
      }
    }
  
    return null
  }
  
  function saveToLocalStorage<T>(key: string, data: T) {
    switch (key) {
      case 'initialItems':
      case 'selectedItems':
        const list = {list: data}
        localStorage.setItem(key, JSON.stringify(list))
        break
      case 'lastModifiedTimestamp':
        const dateObject = {date: new Date().toLocaleDateString()}
        localStorage.setItem(key, JSON.stringify(dateObject))
        break
      case 'calendar':
        const calendar = {calendar: data}
        localStorage.setItem(key, JSON.stringify(calendar))
        break
      case 'counter':
        const counter = {counter: data}
        localStorage.setItem(key, JSON.stringify(counter))
        break
    }
  }

  return {
    getFromLocalStorage,
    saveToLocalStorage
  }
}   
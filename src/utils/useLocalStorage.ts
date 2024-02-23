
export default function useLocalStorage () {
  function clearLocalStorageItem(key:string) {
    localStorage.removeItem(key)
  }
  
  function getFromLocalStorage<T>(key: string): T | null {
    enum Key {
      LIST = 'list',
      DATE = 'date',
      CALENDAR = 'calendar'
    }
    const storedData = localStorage.getItem(key)
  
    if (storedData) {
      const result = JSON.parse(storedData)[Key.LIST] || JSON.parse(storedData)[Key.DATE] || JSON.parse(storedData)[Key.CALENDAR]
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
    }
  }

  return {
    clearLocalStorageItem,
    getFromLocalStorage,
    saveToLocalStorage
  }
}   
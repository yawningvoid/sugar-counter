import { useEffect } from 'react'

function clearLocalStorage() {
  localStorage.clear()
  const dateObject = {date: new Date().toLocaleDateString()}
  localStorage.setItem('lastModifiedTimestamp', JSON.stringify(dateObject))
}

export function getFromLocalStorage<T>(key: string): T | null {
  enum Key {
    LIST = 'list',
    DATE = 'date'
  }
  
  const storedData = localStorage.getItem(key)

  if (storedData) {
    const result = JSON.parse(storedData)[Key.LIST || Key.DATE]
    if (result) {
      return result
    }
  }
  return null
}

export function saveToLocalStorage<T>(key: string, data: T) {
  const list = {list: data}
  localStorage.setItem(key, JSON.stringify(list))
  const dateObject = {date: new Date().toLocaleDateString()}
  localStorage.setItem('lastModifiedTimestamp', JSON.stringify(dateObject))
}

export function isNextDay(lastModifiedDate: string | null): boolean {
  const currentDate = new Date().toLocaleDateString()
  return lastModifiedDate !== currentDate
}

export function useClearLocalStorageEffect() {
	useEffect(() => {
		if (isNextDay(getFromLocalStorage('lastModifiedTimestamp'))) {
			clearLocalStorage()
		}
	}, [])
}
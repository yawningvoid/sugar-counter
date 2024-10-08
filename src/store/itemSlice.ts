import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ItemObject } from '../Item'
import { initialItems } from './initialItems'
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../utils/useLocalStorage'
import { CalendarEntry } from '../Calendar'
import { differenceInCalendarDays } from 'date-fns'
import { v4 as uuid } from 'uuid'

export type Measurement = 'tsp' | 'g'

export interface CounterState {
  initialItems: ItemObject[]
  selectedItems: ItemObject[]
  lastPressedItemId: string | null
  lastSavedDate: string | null
  calendar: CalendarEntry[]
  goal: number
  measurement: Measurement
  counter: number
}

const initialItemsFromLocalStorage =
  getFromLocalStorage<ItemObject[]>('initialItems') || initialItems
const selectedItemsFromLocalStorage =
  getFromLocalStorage<ItemObject[]>('selectedItems') || []
const lastSavedDateFromLocalStorage = getFromLocalStorage<string>(
  'lastModifiedTimestamp',
)
const dateObject = { date: new Date().toLocaleDateString() }
export const initialCalendar: CalendarEntry[] = Array.from(
  { length: 7 },
  (_, index) => {
    const currentDate = new Date()
    // calculate the date for each entry, starting from today's date and going backwards
    currentDate.setDate(currentDate.getDate() - (6 - index))
    return {
      date: currentDate.toLocaleDateString(),
      sugarCounter: null,
      id: uuid(),
    }
  },
)
const calendarFromLocalStorage =
  getFromLocalStorage<CalendarEntry[]>('calendar') || initialCalendar
const counterFromLocalStorage = getFromLocalStorage<number>('counter') || 0
const goalFromLocalStorage = getFromLocalStorage<number>('goal') || 25

const measurementFromLocalStorage = getFromLocalStorage<Measurement>('measurement') || 'g'
const TSP_TO_GRAMS = 5
const convertCounter = (counter: number, measurement: Measurement): number => {
  return measurement === 'tsp'
    ? Math.round(counter / TSP_TO_GRAMS)
    : Math.round(counter * TSP_TO_GRAMS)
}

const updateCounter = (state: CounterState) => {
  const rawCounterInGrams = state.selectedItems.reduce(
    (acc, currentValue) =>
      acc + currentValue.pieces * currentValue.sugarPerPiece,
    0,
  )
  state.counter = state.measurement === 'tsp'
    ? Math.round(rawCounterInGrams / TSP_TO_GRAMS)
    : rawCounterInGrams
  saveToLocalStorage('counter', state.counter)
}

const initialState: CounterState = {
  initialItems: initialItemsFromLocalStorage,
  selectedItems: selectedItemsFromLocalStorage,
  lastPressedItemId: null,
  lastSavedDate: lastSavedDateFromLocalStorage,
  calendar: calendarFromLocalStorage,
  goal: goalFromLocalStorage,
  measurement: measurementFromLocalStorage,
  counter: counterFromLocalStorage,
}

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    createItem: (state, action: PayloadAction<ItemObject>) => {
      state.initialItems.push(action.payload)
      state.lastSavedDate = new Date().toLocaleDateString()
      saveToLocalStorage('initialItems', state.initialItems)
      saveToLocalStorage('lastModifiedTimestamp', dateObject)
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const updatedinitialItems = state.initialItems.filter(
        (item) => item.id !== action.payload,
      )
      state.initialItems = updatedinitialItems
      const updatedSelectedItems = state.selectedItems.filter(
        (item) => item.id !== action.payload,
      )
      state.selectedItems = updatedSelectedItems
      state.lastSavedDate = new Date().toLocaleDateString()
      saveToLocalStorage('initialItems', updatedinitialItems)
      saveToLocalStorage('selectedItems', updatedSelectedItems)
      saveToLocalStorage('lastModifiedTimestamp', dateObject)
      updateCounter(state)
    },
    addSelectedItem: (state, action: PayloadAction<ItemObject>) => {
      state.selectedItems.push(action.payload)
      state.initialItems = state.initialItems.filter(
        (item) => item.id !== action.payload.id,
      )
      state.lastSavedDate = new Date().toLocaleDateString()
      saveToLocalStorage('initialItems', state.initialItems)
      saveToLocalStorage('selectedItems', state.selectedItems)
      saveToLocalStorage('lastModifiedTimestamp', dateObject)
      updateCounter(state)
    },
    removeSelectedItem: (state, action: PayloadAction<string>) => {
      const removedItem = state.selectedItems.find(
        (item) => item.id === action.payload,
      )
      if (removedItem) {
        state.initialItems.unshift(removedItem)
        state.selectedItems = state.selectedItems.filter(
          (item) => item.id !== action.payload,
        )
        state.lastSavedDate = new Date().toLocaleDateString()
        saveToLocalStorage('initialItems', state.initialItems)
        saveToLocalStorage('selectedItems', state.selectedItems)
        saveToLocalStorage('lastModifiedTimestamp', dateObject)
        updateCounter(state)
      }
    },
    addNewDayCustomItems: (state) => {
      const newSelectedItems = state.selectedItems.filter(
        (item) => item.isInitial === false,
      )
      const newInitialItems = state.initialItems.filter(
        (item) => item.isInitial === false,
      )
      const newItems = [...newInitialItems, ...newSelectedItems]
      if (newItems.length > 0) {
        state.initialItems = [...initialItems, ...newItems]
      } else {
        state.initialItems = [...initialItems]
      }
      state.selectedItems = []
      state.lastSavedDate = new Date().toLocaleDateString()
      saveToLocalStorage('initialItems', state.initialItems)
      saveToLocalStorage('selectedItems', [])
      saveToLocalStorage('lastModifiedTimestamp', dateObject)
      // update counter
      state.counter = 0
      saveToLocalStorage('counter', 0)
    },
    setLastPressedItemId: (state, action: PayloadAction<string | null>) => {
      state.lastPressedItemId = action.payload
    },
    editCalendarYesterday: (state) => {
      const calendarDate = state.calendar[6].date
      const currentDate = new Date().toLocaleDateString()
      const daysDifference = differenceInCalendarDays(currentDate, calendarDate)
      const newArray = Array.from({ length: daysDifference }, (_, index) => {
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - (daysDifference - (index + 1)))
  
        // if this is yesterday, check if we have a counter, otherwise set to null
        const isYesterday = index === daysDifference - 1
        const sugarCounter = isYesterday ? state.counter : null
  
        return {
          date: currentDate.toLocaleDateString(),
          sugarCounter,
          id: uuid(),
        }
      })
      state.calendar = [...state.calendar, ...newArray].slice(-7)
      saveToLocalStorage('calendar', state.calendar)
    },
    editCalendarToday: (state, action: PayloadAction<number>) => {
      const newArray = [...state.calendar]
      newArray.pop()
      newArray.push({
        date: new Date().toLocaleDateString(),
        sugarCounter: action.payload,
        id: uuid(),
      })
      state.calendar = newArray
      saveToLocalStorage('calendar', state.calendar)
    },
    setGoal: (state, action: PayloadAction<number>) => {
      state.goal = action.payload
      saveToLocalStorage('goal', state.goal)
    },
    switchMeasurement: (state, action: PayloadAction<'tsp' | 'g'>) => {
      state.measurement = action.payload
      saveToLocalStorage('measurement', state.measurement)
      updateCounter(state)

      // convert calendar
      state.calendar = state.calendar.map((entry) => ({
        ...entry,
        sugarCounter: entry.sugarCounter !== null
          ? convertCounter(entry.sugarCounter, state.measurement)
          : null,
      }))
      saveToLocalStorage('calendar', state.calendar)
    },
  },
})

export const {
  createItem,
  removeSelectedItem,
  addSelectedItem,
  setLastPressedItemId,
  removeItem,
  addNewDayCustomItems,
  editCalendarYesterday,
  editCalendarToday,
  setGoal,
  switchMeasurement,
} = itemSlice.actions
export const itemReducer = itemSlice.reducer

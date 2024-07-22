import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ItemObject } from '../Item'
import { initialItems } from './initialItems'
import { getFromLocalStorage, saveToLocalStorage } from '../utils/useLocalStorage'
import { CalendarEntry } from '../Calendar'
import { differenceInCalendarDays } from "date-fns"
import { v4 as uuid } from 'uuid'

export type Measurement = 'tsp' | 'g'

export interface CounterState {
  isEditGoalModalVisible: boolean
  isEditItemModalVisible: boolean
  initialItems: ItemObject[]
  selectedItems: ItemObject[]
  lastPressedItemId: string | null
  lastSavedDate: string | null
  calendar: CalendarEntry[]
  goal: number
  measurement: Measurement
  counter: number
}

const initialItemsFromLocalStorage = getFromLocalStorage<ItemObject[]>('initialItems') || initialItems
const selectedItemsFromLocalStorage = getFromLocalStorage<ItemObject[]>('selectedItems') || []
const lastSavedDateFromLocalStorage = getFromLocalStorage<string>('lastModifiedTimestamp')
const dateObject = {date: new Date().toLocaleDateString()}
export const initialCalendar: CalendarEntry[] = Array.from({ length: 7 }, (_, index) => {
  const currentDate = new Date()
  // calculate the date for each entry, starting from today's date and going backwards
  currentDate.setDate(currentDate.getDate() - (6 - index))
  return { 
    date: currentDate.toLocaleDateString(), 
    sugarCounter: null, 
    id: uuid()
  }
})
const calendarFromLocalStorage = getFromLocalStorage<CalendarEntry[]>('calendar') || initialCalendar
const counterFromLocalStorage = getFromLocalStorage<number>('counter') || 0

const initialState: CounterState = {
  isEditGoalModalVisible: false,
  isEditItemModalVisible: false,
  initialItems: initialItemsFromLocalStorage,
  selectedItems: selectedItemsFromLocalStorage,
  lastPressedItemId:  null,
  lastSavedDate: lastSavedDateFromLocalStorage,
  calendar: calendarFromLocalStorage,
  goal: 25,
  measurement: 'g',
  counter: counterFromLocalStorage,
}

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setEditGoalModalVisible: (state) => {
      state.isEditGoalModalVisible = !state.isEditGoalModalVisible
    },  
    setEditItemModalVisible: (state) => {
      state.isEditItemModalVisible = !state.isEditItemModalVisible
    },
    createItem: (state, action: PayloadAction<ItemObject>) => {
      state.initialItems.push(action.payload)
      state.lastSavedDate = new Date().toLocaleDateString()
      saveToLocalStorage('initialItems', state.initialItems)
      saveToLocalStorage('lastModifiedTimestamp', dateObject)
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const updatedinitialItems = state.initialItems.filter((item) => item.id !== action.payload)
      state.initialItems = updatedinitialItems
      const updatedSelectedItems = state.selectedItems.filter((item) => item.id !== action.payload)
      state.selectedItems = updatedSelectedItems
      state.lastSavedDate = new Date().toLocaleDateString()
      saveToLocalStorage('initialItems', updatedinitialItems)
      saveToLocalStorage('selectedItems', updatedSelectedItems)
      saveToLocalStorage('lastModifiedTimestamp', dateObject)
      // update counter
      state.counter = state.selectedItems.reduce((acc, currentValue)=> acc + currentValue.pieces * currentValue.sugarPerPiece, 0)
      saveToLocalStorage('counter', state.counter)
    },
    addSelectedItem: (state, action: PayloadAction<ItemObject>) => {
      state.selectedItems.push(action.payload)
      state.initialItems = state.initialItems.filter(item => item.id !== action.payload.id)
      state.lastSavedDate = new Date().toLocaleDateString()
      saveToLocalStorage('initialItems', state.initialItems)
      saveToLocalStorage('selectedItems', state.selectedItems)
      saveToLocalStorage('lastModifiedTimestamp', dateObject)
      // update counter
      state.counter = state.selectedItems.reduce((acc, currentValue)=> acc + currentValue.pieces * currentValue.sugarPerPiece, 0)
      saveToLocalStorage('counter', state.counter)
    },
    removeSelectedItem: (state, action: PayloadAction<string>) => {
      const removedItem = state.selectedItems.find(item => item.id === action.payload)
      if (removedItem) {
        state.initialItems.push(removedItem)
        state.selectedItems = state.selectedItems.filter((item) => item.id !== action.payload)
        state.lastSavedDate = new Date().toLocaleDateString()
        saveToLocalStorage('initialItems', state.initialItems)
        saveToLocalStorage('selectedItems', state.selectedItems)
        saveToLocalStorage('lastModifiedTimestamp', dateObject)
        // update counter
        state.counter = state.selectedItems.reduce((acc, currentValue)=> acc + currentValue.pieces * currentValue.sugarPerPiece, 0)
        saveToLocalStorage('counter', state.counter)
      }
    },
    addNewDayCustomItems: (state) => {
      const newSelectedItems = state.selectedItems.filter((item)=> item.isInitial === false)
      const newInitialItems = state.initialItems.filter((item)=> item.isInitial === false)
      const newItems = [...newInitialItems, ...newSelectedItems]
      if (newItems.length > 0) {
        state.initialItems = [...initialItems,  ...newItems]
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
      const newArray: CalendarEntry[] = Array.from({ length: daysDifference }, (_, index) => {
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - (daysDifference - (index + 1)))
        return {
          date: currentDate.toLocaleDateString(),
          sugarCounter: null,
          id: uuid(),
        }
      })
      state.calendar = [...state.calendar, ...newArray].slice(-7)
      saveToLocalStorage('calendar', state.calendar)
    },
    editCalendarToday: (state, action: PayloadAction<number>) => {
      const newArray = [...state.calendar]
      newArray.pop()
      newArray.push({ date: new Date().toLocaleDateString(), sugarCounter: action.payload, id: uuid() })
      state.calendar = newArray
      saveToLocalStorage('calendar', state.calendar)
    },
    setGoal: (state, action: PayloadAction<number>) => {
      state.goal = action.payload
    },
    switchMeasurement: (state, action: PayloadAction<'tsp' | 'g'>) => {
      state.measurement = action.payload;
    },
  },
})

export const { 
  createItem, 
  setEditGoalModalVisible, 
  setEditItemModalVisible, 
  removeSelectedItem, 
  addSelectedItem, 
  setLastPressedItemId, 
  removeItem, 
  addNewDayCustomItems, 
  editCalendarYesterday,
  editCalendarToday,
  setGoal,
  switchMeasurement
 } 
 = itemSlice.actions
export const itemReducer = itemSlice.reducer

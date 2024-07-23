import { RootState } from './store'
import {
  editCalendarToday,
  editCalendarYesterday,
  addNewDayCustomItems,
} from '../store/itemSlice'
import { createListenerMiddleware } from '@reduxjs/toolkit'

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  predicate: (_action, currentState, previousState) => {
    const state = currentState as RootState
    const prevState = previousState as RootState
    return (
      state.item.counter !== prevState.item.counter ||
      state.item.lastSavedDate !== prevState.item.lastSavedDate
    )
  },
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState
    const lastSavedDate = state.item.lastSavedDate
    const today = new Date().toLocaleDateString()

    if (lastSavedDate !== today) {
      listenerApi.dispatch(editCalendarYesterday())
      listenerApi.dispatch(addNewDayCustomItems())
    } else {
      listenerApi.dispatch(editCalendarToday(state.item.counter))
    }
  },
})

export default listenerMiddleware

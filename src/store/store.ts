import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { itemReducer } from './itemSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import listenerMiddleware from './listenerMiddleware'

const rootReducer = combineReducers({
  item: itemReducer
})

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    preloadedState
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

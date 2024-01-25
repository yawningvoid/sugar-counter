import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ItemObject } from '../Item'
import { initialItems } from './initialItems'

  

interface CounterState {
  value: number
  isModalVisible: boolean
  initialItems: ItemObject[]
  selectedItems: ItemObject[]
  lastPressedItemId: number | null
}

const initialState: CounterState = {
  value: 0,
  isModalVisible: false,
  initialItems: initialItems,
  selectedItems: [],
  lastPressedItemId:  null,
}

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setModalVisible: (state) => {
        state.isModalVisible = !state.isModalVisible
    },
    addNewItem: (state, action: PayloadAction<ItemObject>) => {
        state.initialItems.push(action.payload);
    },
    addSelectedItem: (state, action: PayloadAction<ItemObject>) => {
        state.selectedItems.push(action.payload)
        state.initialItems = state.initialItems.filter(item => item.id !== action.payload.id)
    },
    removeSelectedItem: (state, action: PayloadAction<number>) => {
    const removedItem = state.selectedItems.find(item => item.id === action.payload)
    if (removedItem) {
        state.initialItems.push(removedItem)
        state.selectedItems = state.selectedItems.filter(
        (item) => item.id !== action.payload
        )
    }
    },
    setLastPressedItemId: (state, action: PayloadAction<number | null>) => {
      state.lastPressedItemId = action.payload;
    },
  },
});

export const { addNewItem, setModalVisible, removeSelectedItem, addSelectedItem, setLastPressedItemId } = itemSlice.actions
export const itemReducer = itemSlice.reducer

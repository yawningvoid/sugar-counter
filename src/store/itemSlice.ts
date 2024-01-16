import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
  isModalVisible: boolean
}

const initialState: CounterState = {
  value: 0,
  isModalVisible: false,
}

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setModalVisible: (state) => {
      state.isModalVisible = !state.isModalVisible
    },
    // Action with a payload
    setCounter: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setCounter, setModalVisible } = itemSlice.actions
export const itemReducer = itemSlice.reducer

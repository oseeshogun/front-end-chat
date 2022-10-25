import { createSlice } from '@reduxjs/toolkit'
import { getUniqueItemsByProperties } from '../../utils/utils'

const initialState = {
  messages: [],
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      if (
        state.messages.findIndex((message) => message.id === payload.id) === -1
      ) {
        state.messages = [...state.messages, payload]
      }
    },
    addManyMessages: (state, { payload }) => {
      state.messages = getUniqueItemsByProperties(
        [...payload, ...state.messages],
        'id'
      )
    },
  },
})

export const { addMessage, addManyMessages } = chatSlice.actions

export default chatSlice.reducer
